// Goals:
// 1. Show n random points on a canvas
// 2. Draw a Delaunay triangulation of points
// 3. Draw a Voronoi diagram of points
// 4. Calculate area in each point's cell

// http://www.geom.uiuc.edu/~samuelp/del_project.html
// https://www.codewars.com/kata/areas-of-voronoi-cells

const { randInt } = require('./helpers');
const { Point, Triangle, Segment, Ray, Line, sortPoints } = require('./Geometry');

const pointCount = 30;
const minX = 0;
const minY = 0;
const maxX = 1200;
const maxY = 900;
const width = maxX - minX;
const height = maxY - minY;
const margin = 10;
const CANVAS = document.querySelector('canvas');
const ctx = CANVAS.getContext('2d');
ctx.canvas.width = width;
ctx.canvas.height = height;
const centerPoint = new Point(CANVAS.width / 2, CANVAS.height / 2);
let interval;
let tickFn;
let paused = true;

function initialize() {
  console.log('initialize');
  ctx.canvas.style.backgroundColor = '#ccc';

  const points = new Array(pointCount)
    .fill(null)
    .map(p => new Point(randInt(minX + margin, maxX - margin), randInt(minY + margin, maxY - margin, ctx), true))
    .sort((a, b) => a.x - b.x || a.y - b.y)
    .filter((e, i, a) => !i || e.x !== a[i - 1].x || e.y !== a[i - 1].y);
  tickFn = tick(points);
  // interval = window.setInterval(tickFn, 50);
  document.querySelector('button#togglePlayButton').addEventListener('click', togglePlay);
  document.querySelector('button#tickButton').addEventListener('click', pauseAndTick);
}

function togglePlay(ev, pause = !paused) {
  if (pause) {
    window.clearInterval(interval);
  } else {
    interval = window.setInterval(tickFn, 50);
  }
  paused = pause;
}

function pauseAndTick() {
  togglePlay(null, true);
  tickFn();
}

function tick(points) {
  let savedPoints = points;
  return () => {
    console.log(`%ctick - ${new Date().valueOf()}`, 'background-color: fuchsia ; color: white ; font-weight: bold ; ');
    const [pArr, delaunayEdges, voronoiEdges] = calculatePositions(savedPoints);
    savedPoints = pArr;
    drawScreen(pArr, delaunayEdges, voronoiEdges);
  }
}

function calculatePositions(pArr) {
  pArr.forEach(p => p.updatePosition(ctx.canvas));
  const delaunayEdges = delaunay(pArr);
  const voronoiEdges = voronoi(delaunayEdges);
  return [pArr, delaunayEdges, voronoiEdges];
}

function drawScreen(points, delaunayEdges, voronoiEdges) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawPoints(points);

  for (let edge of delaunayEdges) {
    edge.display(ctx, 'rgba(0,0,0,0.1)');
  }

  for (let s of voronoiEdges) {
    s.display(ctx);
  }
}

function drawPoints(points, color) {
  ctx.beginPath();
  ctx.fillStyle = color || 'black';
  for (let point of points) {
    ctx.moveTo(point.x, point.y);
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
  }
  ctx.closePath();
  ctx.fill();
}

// bowyer-watson algorithm https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
function delaunay(points) {
  // create triangle with circumcircle containing whole grid. each triangle should have point and circumcircle data.
  const bigNum = Number.MAX_SAFE_INTEGER / 3;
  const outerTrianglePoints = [
    new Point(minX - bigNum, maxY + bigNum),
    new Point(minX + width / 2, minY - bigNum),
    new Point(maxX + bigNum, maxY + bigNum),
  ];
  let triangles = [new Triangle(...outerTrianglePoints)];
  for (let p of points) {
    const badTriangles = [];
    const goodTriangles = [];
    for (let triangle of triangles) {
      
      if (triangle.circumCircle.containsPoint(p)) {
        badTriangles.push(triangle);
      } else {
        goodTriangles.push(triangle);
      }
    }
    const newTriangles = badTriangles
      .reduce((arr, t) => [...arr, t.p1, t.p2, t.p3], [])
      .sort((a, b) => p.angleTo(a) - p.angleTo(b) || p.distanceTo(a) - p.distanceTo(b))
      .filter((p, i, a) => !i || !p.equals(a[i - 1]))
      .map((p1, i, arr) => new Triangle(p, p1, arr[(i + 1) % arr.length]));
    
    triangles = [...goodTriangles, ...newTriangles];
  }

  triangles = triangles.filter(t => !outerTrianglePoints.some(otp => [t.p1, t.p2, t.p3].includes(otp)));
  // for (let triangle of triangles) {
  //   triangle.display(ctx);
  // }
  console.log(triangles.length)

  if (triangles.length > 52) {
    console.log({triangles});
    togglePlay(null, true);
  }
  return triangles;
}

function trianglesToEdges(triangles) {
  const edges = triangles.reduce((a, t) => [...a, new Segment(t.p1, t.p2), new Segment(t.p2, t.p3), new Segment(t.p3, t.p1)], []);
  const uniqueEdges = edges.sort((a, b) => a.p1.compareTo(b.p1) || a.p2.compareTo(b.p2)).filter((s, i, a) => !i || !s.equals(a[i - 1]));
  const circumCenters = triangles.map(t => t.circumCircle.center);
  // drawPoints(circumCenters, 'fuschia');
  return uniqueEdges;
}

function voronoi(triangles) {

  const sharedEdges = [];
  for (let i = 0; i < triangles.length - 1; i++) {
    for (let j = i + 1; j < triangles.length; j++) {
      const [t1, t2] = [triangles[i], triangles[j]];
      if (t1.sharesEdge(t2)) {
        const s = new Segment(t1.circumCircle.center, t2.circumCircle.center);
        sharedEdges.push(s);
      }
    }
  }

  // for (let s of sharedEdges) {
  //   s.display(ctx, 'white');
  // }

  const edges = {};
  for (const t of triangles) {
    const e1 = new Segment(t.p1, t.p2);
    const e2 = new Segment(t.p2, t.p3);
    const e3 = new Segment(t.p3, t.p1);
    for (let edge of [e1, e2, e3]) {
      if (edges[edge.toString()]) {
        edges[edge.toString()].triangles.push(t);
      } else {
        edges[edge.toString()] = { edge, triangles: [t] };
      }
    }
  }

  const outerEdges = Object.values(edges)
    .filter(e => {
      return e.triangles.length === 1 && e.triangles[0].circumCircle.center.isWithinCanvas(ctx.canvas);
    })
    .map(e => {
      const origin = e.triangles[0].circumCircle.center;
      const edgeCenter = e.edge.getCenter()
      const args = [origin, edgeCenter, maxX, maxY];
      const originDistance = centerPoint.distanceTo(origin);
      const edgeDistance = centerPoint.distanceTo(edgeCenter);
      const startAway =  (originDistance > edgeDistance);
      return new Ray(...args, startAway);
    });

  return [...sharedEdges, ...outerEdges];
}

initialize();

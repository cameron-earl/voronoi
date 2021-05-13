/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Geometry.js":
/*!*************************!*\
  !*** ./src/Geometry.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const sortPoints = (a, b) => a.x - b.x || a.y - b.y;\n\nclass Point {\n\n  constructor(x, y, setVelocity = false) {\n    const randomV = () => (Math.random() - 0.5) * 3;\n    this.x = x;\n    this.y = y;\n    if (setVelocity) {\n      this.velocityX = randomV();\n      this.velocityY = randomV();\n    }\n  }\n\n  distanceTo(p2) {\n    return Math.sqrt((p2.x - this.x) ** 2 + (p2.y - this.y) ** 2);\n  }\n\n  angleTo(p2) {\n    return Math.atan2(p2.y - this.y, p2.x - this.x);\n  }\n\n  compareTo(p2) {\n    return this.x - p2.x || this.y - p2.y;\n  }\n\n  equals(p2) {\n    return this.x === p2.x && this.y === p2.y;\n  }\n\n  display(ctx, color = 'green') {\n    // ctx.beginPath();\n    // ctx.fillStyle = color;\n    // ctx.moveTo(this.x, this.y);\n    // ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);\n    // ctx.closePath();\n    // ctx.fill();\n  }\n  \n  toString() {\n    return `(${this.x},${this.y})`;\n  }\n\n  updatePosition(canvas) {\n    if (!this.velocityX || !this.velocityY) {\n      return;\n    }\n    let newX = this.x + this.velocityX;\n    if (newX < 0 || newX > canvas.width) {\n      this.velocityX *= -1;\n      newX += this.velocityX;\n    }\n\n    this.x = newX;\n\n    let newY = this.y + this.velocityY;\n    if (newY < 0 || newY > canvas.height) {\n      this.velocityY *= -1;\n      newY += this.velocityY;\n    }\n\n    this.y = newY;\n  }\n\n  isWithinCanvas(canvas) {\n    return this.x > 0 && this.y > 0 && this.x < canvas.width && this.y < canvas.height;\n  }\n}\n\nclass Segment {\n  constructor(p1, p2) {\n    const points = [p1, p2].sort(sortPoints);\n    this.p1 = points[0];\n    this.p2 = points[1];\n    this.m = (p2.y - p1.y) / (p2.x - p1.x);\n    if (this.m === -Infinity || this.m === -0) this.m = Math.abs(this.m);\n  }\n\n  getCenter() {\n    return new Point((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2);\n  }\n\n  getLinePerpendicularToCenter() {\n    const inverseSlope = this.m === 0 ? Infinity : this.m === Infinity ? 0 : -1 / this.m;\n    return new Line(inverseSlope, this.getCenter());\n  }\n\n  getLength() {\n    return this.p1.distanceTo(this.p2);\n  }\n\n  getIntersect(s2) {\n    if (!(s2 instanceof Segment) && !(s2 instanceof Line)) {\n      throw new Exception('Can only find intersect with other Segment or a Line');\n    }\n    const l1 = new Line(this);\n    const l2 = new Line(s2);\n    const intersect = l1.getIntersect(l2);\n    if (this.containsPoint(intersect)) return intersect;\n    return null;\n  }\n\n  containsPoint(p) {\n    const [a, b] = [this.p1, this.p2];\n    const crossProduct = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);\n    if (Math.abs(crossProduct) > Number.EPSILON) return false; // points not aligned\n    const dotProduct = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);\n    if (dotProduct < 0) return false; // not in range\n    const squaredLengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);\n    if (dotProduct > squaredLengthba) return false; // not in range\n    return true;\n  }\n\n  display(ctx, color = 'blue') {\n    ctx.beginPath();\n    if (!this.p1.isWithinCanvas(ctx.canvas) || !this.p2.isWithinCanvas(ctx.canvas)) {\n      color = 'magenta';\n      if ([this.p1.x, this.p1.y, this.p2.x, this.p2.y].some(n => Math.abs(n) > 10000)) {\n        color = 'lime';\n        // console.log('blah', this.p1, this.p2);\n      }\n    }\n    ctx.strokeStyle = color;\n    ctx.moveTo(this.p1.x, this.p1.y);\n    ctx.lineTo(this.p2.x, this.p2.y);\n    ctx.closePath();\n    ctx.stroke();\n  }\n\n  toString() {\n    return this.p1.toString() + '->' + this.p2.toString();\n  }\n\n  equals(s2) {\n    return this.p1.equals(s2.p1) && this.p2.equals(s2.p2);\n  }\n}\n\nclass Line {\n  constructor(...args) {\n    if (args.length === 1 && args[0] instanceof Segment) {\n      return new Line(args[0].m, args[0].p1);\n    } else if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {\n      const [p1, p2] = args;\n      this.setM((p2.y - p1.y)/(p2.x - p1.x));\n      const b = p1.y - this.m * p1.x;\n      this.p = Math.abs(b) === Infinity ? new Point(p1.x, 0) : new Point(0, b);\n    } else if (args.length === 2 && typeof args[0] === 'number' && args[1] instanceof Point) {\n      this.setM(args[0]);\n      const b = args[1].y - args[0] * args[1].x;\n      this.p = Math.abs(b) === Infinity ? new Point(args[1].x, 0) : new Point(0, b);\n    } else if (args.length == 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {\n      this.setM(args[0]);\n      this.p = new Point(0, args[1]);\n    } else {\n      console.error(args);\n      throw Error('Please instantiate with Segment, two Points, slope and Point, or slope and y-intercept.');\n    }\n  }\n\n  setM(m) {\n    this.m = m === -Infinity || m === -0 ? Math.abs(m) : m;\n  }\n\n  getIntersect(l2) {\n    if (l2.m === this.m) return null;\n    if (this.isVertical()) {\n      return l2.getPointAtX(this.p.x);\n    } else if (l2.isVertical()) {\n      return this.getPointAtX(l2.p.x);\n    }\n    const x = (l2.getB() - this.getB()) / (this.m - l2.m);\n    const y = this.m * x + this.getB();\n    return new Point(x, y);\n  }\n\n  getPointAtX(x) {\n    if (this.isVertical()) return null;\n    if (this.isHorizontal()) return new Point(x, this.p.y);\n    const y = this.m * x + this.getB();\n    return new Point(x, y);\n  }\n\n  getPointAtY(y) {\n    if (this.isHorizontal()) return null;\n    if (this.isVertical()) return new Point(this.p.x, y);\n    const x = (y - this.getB()) / this.m;\n    return new Point(x, y);\n  }\n\n  getB() {\n    return this.isVertical() ? null : this.p.y;\n  }\n\n  isVertical() {\n    return this.m === Infinity;\n  }\n\n  isHorizontal() {\n    return this.m === 0;\n  }\n\n  compare(l1, l2) {\n    return l1.m - l2.m || l1.getB() - l2.getB();\n  }\n\n  display(ctx, color = 'orange') {\n    const start = this.isVertical() ? this.getPointAtY(0) : this.getPointAtX(0);\n    const end = this.isVertical() ? this.getPointAtY(ctx.canvas.height) : this.getPointAtX(ctx.canvas.width);\n    ctx.beginPath();\n    ctx.strokeStyle = color;\n    ctx.moveTo(start.x, start.y);\n    ctx.lineTo(end.x, end.y);\n    ctx.closePath();\n    ctx.stroke();\n  }\n}\n\nclass Ray extends Segment {\n\n  constructor(origin, p, maxX, maxY, awayFromP = false) {\n    if (origin.x < 0 || origin.x > maxX || origin.y < 0 || origin.Y > maxY) {\n      return new Segment(new Point(-1,-1), new Point(-2, -2));\n    }\n\n    const l = new Line(origin, p);\n    let edgeP = l.getPointAtX((p.x < origin.x !== awayFromP) ? 0 : maxX);\n    if (!edgeP || edgeP.y > maxY || edgeP.y < 0) {\n      edgeP = l.getPointAtY((p.y < origin.y !== awayFromP)  ? 0 : maxY);\n    }\n    const val = super(origin, edgeP);\n    val.awayFromP = awayFromP;\n    this.awayFromP = awayFromP\n    return val;\n  }\n\n  display(ctx, color = this.awayFromP ? 'red' : 'white') {\n    ctx.beginPath();\n    ctx.strokeStyle = color;\n    ctx.moveTo(this.p1.x, this.p1.y);\n    ctx.lineTo(this.p2.x, this.p2.y);\n    ctx.closePath();\n    ctx.stroke();\n  }\n}\n\nclass Circle {\n  constructor(...args) {\n    if (args.length === 3 && args.every(p => p instanceof Point)) {\n      const [p1, p2, p3] = args;\n      const l1 = new Segment(p1, p2).getLinePerpendicularToCenter();\n      const l2 = new Segment(p2, p3).getLinePerpendicularToCenter();\n      this.l1 = l1;\n      this.l2 = l2;\n      this.center = l1.getIntersect(l2);\n      this.radius = this.center.distanceTo(p1);\n    } else if (args.length === 2 && args[0] instanceof Point && typeof args[1] === 'number') {\n      [this.center, this.radius] = args;\n    }\n  }\n\n  containsPoint(p) {\n    \n    return this.center.distanceTo(p) < this.radius;\n  }\n\n  display(ctx, color = 'rgba(255,0,0,.1)') {\n    ctx.beginPath();\n    ctx.fillStyle = color;\n    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);\n    ctx.fill();\n    ctx.closePath();\n  }\n}\n\nclass Triangle {\n  constructor(p1, p2, p3) {\n    if (![p1, p2, p3].every(p => p instanceof Point)) {\n      console.error(p1, p2, p3);\n      throw Error('Triangle must be instantiated with three Points');\n    }\n    this.p1 = p1;\n    this.p2 = p2;\n    this.p3 = p3;\n    this.circumCircle = new Circle(p1, p2, p3);\n  }\n\n  sharesEdge(t2) {\n    let shareCount = 0;\n    for (let pA of [this.p1, this.p2, this.p3]) {\n      for (let pB of [t2.p1, t2.p2, t2.p3]) {\n        if (pA.equals(pB)) {\n          shareCount++;\n        }\n      }\n    }\n    return shareCount === 2;\n  }\n\n  containsPoint(p) {\n    const {p1, p2, p3} = this;\n    const A = 1/2 * (-p2.y * p3.x + p1.y * (-p2.x + p3.x) + p1.x * (p2.y - p3.y) + p2.x * p3.y);\n    const sign = A < 0 ? -1 : 1;\n    const s = (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * p.x + (p1.x - p3.x) * p.y) * sign;\n    const t = (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * p.x + (p2.x - p1.x) * p.y) * sign;\n    \n    return s > 0 && t > 0 && (s + t) < 2 * A * sign;\n  }\n\n  containsCircumcenter() {\n    return this.containsPoint(this.circumCircle.center);\n  }\n\n  display(ctx, color = 'black') {\n    ctx.beginPath();\n    // ctx.fillStyle = 'rgba(255,255,0,0.5)';\n    ctx.strokeStyle = color;\n    ctx.moveTo(this.p1.x, this.p1.y);\n    ctx.lineTo(this.p2.x, this.p2.y);\n    ctx.lineTo(this.p3.x, this.p3.y);\n    ctx.lineTo(this.p1.x, this.p1.y);\n    ctx.closePath();\n    // ctx.fill();\n    ctx.stroke();\n  }\n}\n\nmodule.exports = { Point, Segment, Ray, Line, Circle, Triangle, sortPoints };\n\n\n//# sourceURL=webpack:///./src/Geometry.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const randInt = (min, max) => {\n\tmin = Math.ceil(min);\n\tmax = Math.floor(max);\n\treturn Math.floor(Math.random() * (max - min + 1)) + min;\n};\n\nmodule.exports = {randInt};\n\n//# sourceURL=webpack:///./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Goals:\n// 1. Show n random points on a canvas\n// 2. Draw a Delaunay triangulation of points\n// 3. Draw a Voronoi diagram of points\n// 4. Calculate area in each point's cell\n\n// http://www.geom.uiuc.edu/~samuelp/del_project.html\n// https://www.codewars.com/kata/areas-of-voronoi-cells\n\nconst { randInt } = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\nconst { Point, Triangle, Segment, Ray, Line, sortPoints } = __webpack_require__(/*! ./Geometry */ \"./src/Geometry.js\");\n\nconst pointCount = 30;\nconst minX = 0;\nconst minY = 0;\nconst maxX = 1200;\nconst maxY = 900;\nconst width = maxX - minX;\nconst height = maxY - minY;\nconst margin = 10;\nconst CANVAS = document.querySelector('canvas');\nconst ctx = CANVAS.getContext('2d');\nctx.canvas.width = width;\nctx.canvas.height = height;\nconst centerPoint = new Point(CANVAS.width / 2, CANVAS.height / 2);\nlet interval;\nlet tickFn;\nlet paused = true;\n\nfunction initialize() {\n  console.log('initialize');\n  ctx.canvas.style.backgroundColor = '#ccc';\n\n  const points = new Array(pointCount)\n    .fill(null)\n    .map(p => new Point(randInt(minX + margin, maxX - margin), randInt(minY + margin, maxY - margin, ctx), true))\n    .sort((a, b) => a.x - b.x || a.y - b.y)\n    .filter((e, i, a) => !i || e.x !== a[i - 1].x || e.y !== a[i - 1].y);\n  tickFn = tick(points);\n  // interval = window.setInterval(tickFn, 50);\n  document.querySelector('button#togglePlayButton').addEventListener('click', togglePlay);\n  document.querySelector('button#tickButton').addEventListener('click', pauseAndTick);\n}\n\nfunction togglePlay(ev, pause = !paused) {\n  if (pause) {\n    window.clearInterval(interval);\n  } else {\n    interval = window.setInterval(tickFn, 50);\n  }\n  paused = pause;\n}\n\nfunction pauseAndTick() {\n  togglePlay(null, true);\n  tickFn();\n}\n\nfunction tick(points) {\n  let savedPoints = points;\n  return () => {\n    console.log(`%ctick - ${new Date().valueOf()}`, 'background-color: fuchsia ; color: white ; font-weight: bold ; ');\n    const [pArr, delaunayEdges, voronoiEdges] = calculatePositions(savedPoints);\n    savedPoints = pArr;\n    drawScreen(pArr, delaunayEdges, voronoiEdges);\n  }\n}\n\nfunction calculatePositions(pArr) {\n  pArr.forEach(p => p.updatePosition(ctx.canvas));\n  const delaunayEdges = delaunay(pArr);\n  const voronoiEdges = voronoi(delaunayEdges);\n  return [pArr, delaunayEdges, voronoiEdges];\n}\n\nfunction drawScreen(points, delaunayEdges, voronoiEdges) {\n  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\n\n  drawPoints(points);\n\n  for (let edge of delaunayEdges) {\n    edge.display(ctx, 'rgba(0,0,0,0.1)');\n  }\n\n  for (let s of voronoiEdges) {\n    s.display(ctx);\n  }\n}\n\nfunction drawPoints(points, color) {\n  ctx.beginPath();\n  ctx.fillStyle = color || 'black';\n  for (let point of points) {\n    ctx.moveTo(point.x, point.y);\n    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);\n  }\n  ctx.closePath();\n  ctx.fill();\n}\n\n// bowyer-watson algorithm https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm\nfunction delaunay(points) {\n  // create triangle with circumcircle containing whole grid. each triangle should have point and circumcircle data.\n  const bigNum = Number.MAX_SAFE_INTEGER / 3;\n  const outerTrianglePoints = [\n    new Point(minX - bigNum, maxY + bigNum),\n    new Point(minX + width / 2, minY - bigNum),\n    new Point(maxX + bigNum, maxY + bigNum),\n  ];\n  let triangles = [new Triangle(...outerTrianglePoints)];\n  for (let p of points) {\n    const badTriangles = [];\n    const goodTriangles = [];\n    for (let triangle of triangles) {\n      \n      if (triangle.circumCircle.containsPoint(p)) {\n        badTriangles.push(triangle);\n      } else {\n        goodTriangles.push(triangle);\n      }\n    }\n    const newTriangles = badTriangles\n      .reduce((arr, t) => [...arr, t.p1, t.p2, t.p3], [])\n      .sort((a, b) => p.angleTo(a) - p.angleTo(b) || p.distanceTo(a) - p.distanceTo(b))\n      .filter((p, i, a) => !i || !p.equals(a[i - 1]))\n      .map((p1, i, arr) => new Triangle(p, p1, arr[(i + 1) % arr.length]));\n    \n    triangles = [...goodTriangles, ...newTriangles];\n  }\n\n  triangles = triangles.filter(t => !outerTrianglePoints.some(otp => [t.p1, t.p2, t.p3].includes(otp)));\n  // for (let triangle of triangles) {\n  //   triangle.display(ctx);\n  // }\n  console.log(triangles.length)\n\n  if (triangles.length > 52) {\n    console.log({triangles});\n    togglePlay(null, true);\n  }\n  return triangles;\n}\n\nfunction trianglesToEdges(triangles) {\n  const edges = triangles.reduce((a, t) => [...a, new Segment(t.p1, t.p2), new Segment(t.p2, t.p3), new Segment(t.p3, t.p1)], []);\n  const uniqueEdges = edges.sort((a, b) => a.p1.compareTo(b.p1) || a.p2.compareTo(b.p2)).filter((s, i, a) => !i || !s.equals(a[i - 1]));\n  const circumCenters = triangles.map(t => t.circumCircle.center);\n  // drawPoints(circumCenters, 'fuschia');\n  return uniqueEdges;\n}\n\nfunction voronoi(triangles) {\n\n  const sharedEdges = [];\n  for (let i = 0; i < triangles.length - 1; i++) {\n    for (let j = i + 1; j < triangles.length; j++) {\n      const [t1, t2] = [triangles[i], triangles[j]];\n      if (t1.sharesEdge(t2)) {\n        const s = new Segment(t1.circumCircle.center, t2.circumCircle.center);\n        sharedEdges.push(s);\n      }\n    }\n  }\n\n  // for (let s of sharedEdges) {\n  //   s.display(ctx, 'white');\n  // }\n\n  const edges = {};\n  for (const t of triangles) {\n    const e1 = new Segment(t.p1, t.p2);\n    const e2 = new Segment(t.p2, t.p3);\n    const e3 = new Segment(t.p3, t.p1);\n    for (let edge of [e1, e2, e3]) {\n      if (edges[edge.toString()]) {\n        edges[edge.toString()].triangles.push(t);\n      } else {\n        edges[edge.toString()] = { edge, triangles: [t] };\n      }\n    }\n  }\n\n  const outerEdges = Object.values(edges)\n    .filter(e => {\n      return e.triangles.length === 1 && e.triangles[0].circumCircle.center.isWithinCanvas(ctx.canvas);\n    })\n    .map(e => {\n      const origin = e.triangles[0].circumCircle.center;\n      const edgeCenter = e.edge.getCenter()\n      const args = [origin, edgeCenter, maxX, maxY];\n      const originDistance = centerPoint.distanceTo(origin);\n      const edgeDistance = centerPoint.distanceTo(edgeCenter);\n      const startAway =  (originDistance > edgeDistance);\n      return new Ray(...args, startAway);\n    });\n\n  return [...sharedEdges, ...outerEdges];\n}\n\ninitialize();\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });
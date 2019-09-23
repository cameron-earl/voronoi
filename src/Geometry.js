const sortPoints = (a, b) => a.x - b.x || a.y - b.y;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(p2) {
    return Math.sqrt((p2.x - this.x) ** 2 + (p2.y - this.y) ** 2);
  }

  angleTo(p2) {
    return Math.atan2(p2.y - this.y, p2.x - this.x);
  }

  compareTo(p2) {
    return this.x - p2.x || this.y - p2.y;
  }

  equals(p2) {
    return this.x === p2.x && this.y === p2.y;
  }

  display(ctx, color = 'green') {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  
  toString() {
    return `(${this.x},${this.y})`;
  }
}

class Segment {
  constructor(p1, p2) {
    // console.log('segment constructor', p1, p2)
    const points = [p1, p2].sort(sortPoints);
    this.p1 = points[0];
    this.p2 = points[1];
    this.m = (p2.y - p1.y) / (p2.x - p1.x);
    if (this.m === -Infinity || this.m === -0) this.m = Math.abs(this.m);
  }

  getCenter() {
    return new Point((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2);
  }

  getLinePerpendicularToCenter() {
    const inverseSlope = this.m === 0 ? Infinity : this.m === Infinity ? 0 : -1 / this.m;
    return new Line(inverseSlope, this.getCenter());
  }

  getLength() {
    return this.p1.distanceTo(this.p2);
  }

  getIntersect(s2) {
    if (!(s2 instanceof Segment) && !(s2 instanceof Line)) {
      throw new Exception('Can only find intersect with other Segment or a Line');
    }
    const l1 = new Line(this);
    const l2 = new Line(s2);
    const intersect = l1.getIntersect(l2);
    if (this.containsPoint(intersect)) return intersect;
    return null;
  }

  containsPoint(p) {
    const [a, b] = [this.p1, this.p2];
    const crossProduct = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
    if (Math.abs(crossProduct) > Number.EPSILON) return false; // points not aligned
    const dotProduct = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
    if (dotProduct < 0) return false; // not in range
    const squaredLengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
    if (dotProduct > squaredLengthba) return false; // not in range
    // console.log('containsPoint', this, p, crossProduct, dotProduct, squaredLengthba)
    return true;
  }

  display(ctx, color = 'blue') {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.closePath();
    ctx.stroke();
  }

  toString() {
    return this.p1.toString() + '->' + this.p2.toString();
  }

  equals(s2) {
    return this.p1.equals(s2.p1) && this.p2.equals(s2.p2);
  }
}

class Line {
  constructor(...args) {
    // console.log('Line constructor', ...args)
    if (args.length === 1 && args[0] instanceof Segment) {
      return new Line(args[0].m, args[0].p1);
    } else if (args.length === 2 && args[0] instanceof Point && args[1] instanceof Point) {
      const [p1, p2] = args;
      this.setM((p2.y - p1.y)/(p2.x - p1.x));
      const b = p1.y - this.m * p1.x;
      this.p = Math.abs(b) === Infinity ? new Point(p1.x, 0) : new Point(0, b);
    } else if (args.length === 2 && typeof args[0] === 'number' && args[1] instanceof Point) {
      this.setM(args[0]);
      const b = args[1].y - args[0] * args[1].x;
      this.p = Math.abs(b) === Infinity ? new Point(args[1].x, 0) : new Point(0, b);
    } else if (args.length == 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.setM(args[0]);
      this.p = new Point(0, args[1]);
    } else {
      console.error(args);
      throw Error('Please instantiate with Segment, two Points, slope and Point, or slope and y-intercept.');
    }
  }

  setM(m) {
    this.m = m === -Infinity || m === -0 ? Math.abs(m) : m;
  }

  getIntersect(l2) {
    if (l2.m === this.m) return null;
    if (this.isVertical()) {
      return l2.getPointAtX(this.p.x);
    } else if (l2.isVertical()) {
      return this.getPointAtX(l2.p.x);
    }
    const x = (l2.getB() - this.getB()) / (this.m - l2.m);
    const y = this.m * x + this.getB();
    return new Point(x, y);
  }

  getPointAtX(x) {
    if (this.isVertical()) return null;
    if (this.isHorizontal()) return new Point(x, this.p.y);
    const y = this.m * x + this.getB();
    return new Point(x, y);
  }

  getPointAtY(y) {
    if (this.isHorizontal()) return null;
    if (this.isVertical()) return new Point(this.p.x, y);
    const x = (y - this.getB()) / this.m;
    return new Point(x, y);
  }

  getB() {
    return this.isVertical() ? null : this.p.y;
  }

  isVertical() {
    return this.m === Infinity;
  }

  isHorizontal() {
    return this.m === 0;
  }

  compare(l1, l2) {
    return l1.m - l2.m || l1.getB() - l2.getB();
  }

  display(ctx, color = 'orange') {
    const start = this.isVertical() ? this.getPointAtY(0) : this.getPointAtX(0);
    const end = this.isVertical() ? this.getPointAtY(ctx.canvas.height) : this.getPointAtX(ctx.canvas.width);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();
  }
}

class Ray extends Segment {
  constructor(origin, p, maxX, maxY, awayFromP = false) {
    if (origin.x < 0 || origin.x > maxX || origin.y < 0 || origin.Y > maxY) {
      return new Segment(new Point(-1,-1), new Point(-2, -2));
    }

    const l = new Line(origin, p);
    let edgeP = l.getPointAtX((p.x < origin.x !== awayFromP) ? 0 : maxX);
    if (!edgeP || edgeP.y > maxY || edgeP.y < 0) {
      edgeP = l.getPointAtY((p.y < origin.y !== awayFromP)  ? 0 : maxY);
    }
    console.log('Ray constructor', origin, p, awayFromP, edgeP);
    return super(origin, edgeP);
  }
}

class Circle {
  constructor(...args) {
    if (args.length === 3 && args.every(p => p instanceof Point)) {
      const [p1, p2, p3] = args;
      const l1 = new Segment(p1, p2).getLinePerpendicularToCenter();
      const l2 = new Segment(p2, p3).getLinePerpendicularToCenter();
      this.l1 = l1;
      this.l2 = l2;
      this.center = l1.getIntersect(l2);
      this.radius = this.center.distanceTo(p1);
    } else if (args.length === 2 && args[0] instanceof Point && typeof args[1] === 'number') {
      [this.center, this.radius] = args;
    }
  }

  containsPoint(p) {
    
    return this.center.distanceTo(p) < this.radius;
  }

  display(ctx, color = 'rgba(255,0,0,.1)') {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

class Triangle {
  constructor(p1, p2, p3) {
    if (![p1, p2, p3].every(p => p instanceof Point)) {
      console.error(p1, p2, p3);
      throw Error('Triangle must be instantiated with three Points');
    }
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.circumCircle = new Circle(p1, p2, p3);
  }

  sharesEdge(t2) {
    let shareCount = 0;
    for (let pA of [this.p1, this.p2, this.p3]) {
      for (let pB of [t2.p1, t2.p2, t2.p3]) {
        if (pA.equals(pB)) {
          shareCount++;
        }
      }
    }
    return shareCount === 2;
  }

  containsPoint(p) {
    const {p1, p2, p3} = this;
    const A = 1/2 * (-p2.y * p3.x + p1.y * (-p2.x + p3.x) + p1.x * (p2.y - p3.y) + p2.x * p3.y);
    const sign = A < 0 ? -1 : 1;
    const s = (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * p.x + (p1.x - p3.x) * p.y) * sign;
    const t = (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * p.x + (p2.x - p1.x) * p.y) * sign;
    
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
  }

  containsCircumcenter() {
    return this.containsPoint(this.circumCircle.center);
  }

  display(ctx, color = 'black') {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,0,0.5)';
    ctx.strokeStyle = color;
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.lineTo(this.p3.x, this.p3.y);
    ctx.lineTo(this.p1.x, this.p1.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

module.exports = { Point, Segment, Ray, Line, Circle, Triangle, sortPoints };

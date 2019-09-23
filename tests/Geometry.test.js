const { Point, Line, Segment, Circle, Ray, Triangle } = require('../src/Geometry');

describe('Point', () => {
  describe('distanceTo', () => {
    it('should calculate the distance between two points correctly', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(3, 4);
      expect(p1.distanceTo(p2)).toBe(5);
    });
  });

  describe('angleTo', () => {
    it('should return 0 for a point to the right', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(2, 0);
      expect(p1.angleTo(p2)).toBe(0);
    });
    it('should return pi/4 for a point at 45deg', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(1, 1);
      expect(p1.angleTo(p2)).toBe(0.25 * Math.PI);
    });
    it('should return -pi/4 for a point at -45deg', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(1, -1);
      expect(p1.angleTo(p2)).toBe(-0.25 * Math.PI);
    });
    it('should return pi for a point at to the left', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(-1, 0);
      expect(p1.angleTo(p2)).toBe(Math.PI);
    });
  });

  describe('equals', () => {
    it('should return false for different points', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(1, 1);
      expect(p1.equals(p2)).toBe(false);
    });
    it('should return true for points at same coord', () => {
      const p1 = new Point(0, 5);
      const p2 = new Point(0, 5);
      expect(p1.equals(p2)).toBe(true);
    });
  });
});

describe('Segment', () => {
  describe('getLinePerpendicularToCenter', () => {
    it('should get correct slope for segment with slope=1', () => {
      const s = new Segment(new Point(0, 0), new Point(1, 1));
      const actual = s.getLinePerpendicularToCenter();
      expect(actual.m).toBe(-1);
    });
  });

  describe('containsPoint', () => {
    const s = new Segment(new Point(0, 0), new Point(2, 2));

    it('should return false when outside line', () => {
      const p = new Point(0, 1);
      expect(s.containsPoint(p)).toBeFalsy();
    });

    it('should return false when inside line but outside segment', () => {
      const p = new Point(3, 3);
      expect(s.containsPoint(p)).toBeFalsy();
    });

    it('should return true when inside segment', () => {
      const p = new Point(1, 1);
      expect(s.containsPoint(p)).toBeTruthy();
    });

    it('should return true when at segment end', () => {
      const p = new Point(2, 2);
      expect(s.containsPoint(p)).toBeTruthy();
    });
  });
});

describe('Circle', () => {
  describe('3 points constructor', () => {
    it('should have correct center', () => {
      const p1 = new Point(6, 0);
      const p2 = new Point(0, 0);
      const p3 = new Point(0, 8);
      const c = new Circle(p1, p2, p3);
      expect(c.center.x).toBe(3);
      expect(c.center.y).toBe(4);
    });
  });
});

describe('Line', () => {
  describe('getIntersect', () => {
    it('should return correct value for simple values', () => {
      const l1 = new Line(1, 0);
      const l2 = new Line(-1, 2);
      const actual = l1.getIntersect(l2);
      expect(actual.x).toBe(1);
      expect(actual.y).toBe(1);
    });
  });
});

describe('Ray', () => {
  describe('constructor', () => {
    const origin = new Point(1, 1);
    const [maxX, maxY] = [2, 2];

    it('should create segment going right', () => {
      const p = new Point(1.5, 1);
      const actual = new Ray(origin, p, maxX, maxY);
      expect(actual.p1.x).toBe(origin.x);
      expect(actual.p1.y).toBe(origin.y);
      expect(actual.p2.x).toBe(2);
      expect(actual.p2.y).toBe(1);
    });

    it('should create segment going down', () => {
      const p = new Point(1, 1.5);
      const actual = new Ray(origin, p, maxX, maxY);
      expect(actual.p1.x).toBe(origin.x);
      expect(actual.p1.y).toBe(origin.y);
      expect(actual.p2.x).toBe(1);
      expect(actual.p2.y).toBe(2);
    });

    it('should create segment going left', () => {
      const p = new Point(0.5, 1);
      const actual = new Ray(origin, p, maxX, maxY);
      expect(actual.p2.x).toBe(origin.x);
      expect(actual.p2.y).toBe(origin.y);
      expect(actual.p1.x).toBe(0);
      expect(actual.p1.y).toBe(1);
    });

    it('should create segment going up', () => {
      const p = new Point(1, 0.5);
      const actual = new Ray(origin, p, maxX, maxY);
      expect(actual.p2.x).toBe(origin.x);
      expect(actual.p2.y).toBe(origin.y);
      expect(actual.p1.x).toBe(1);
      expect(actual.p1.y).toBe(0);
    });

    it('should create segement going down and right', () => {
      const p = new Point(1.25, 1.5);
      const actual = new Ray(origin, p, maxX, maxY);
      expect(actual.p1.x).toBe(origin.x);
      expect(actual.p1.y).toBe(origin.y);
      expect(actual.p2.x).toBe(1.5);
      expect(actual.p2.y).toBe(2);
    })
  });
});

describe('Triangle', () => {
  describe('containsPoint', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(2, 4);
    const p3 = new Point(4, 0);
    const t = new Triangle(p1, p2, p3);

    it('should return true when point in triangle', () => {
      const p = new Point(1, 1);
      expect(t.containsPoint(p)).toBeTruthy();
    });

    it('should return false when point outside triangle', () => {
      const p = new Point(0, 1);
      expect(t.containsPoint(p)).toBeFalsy();
    });

    it('should return true when point outside triangle', () => {
      const p = new Point(0, 1);
      expect(t.containsPoint(p)).toBeFalsy();
    });
  });
});
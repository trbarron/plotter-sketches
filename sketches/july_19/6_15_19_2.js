import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { createTriangle, logSeed, settings } from "../../util";
import { lerp, clamp } from "canvas-sketch-util/math";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.05;

  const stems = 70;
  const stemPoints = 2;
  const angle = 120;
  var leg_size = 0.85;
  const freq = 3;
  const amp = 0.00;
  const peaks = 49;

  var startX = 0.25;
  var startY = 0.65;
  var startAngle = 30;

  const points1 = createTriangle(stems, stemPoints,startX,startY, startAngle ,angle,leg_size).map(point => {
    var [u, v] = point;
    
    //var noise = ((cols-1)*u)%2 == 1 ? amp : 0;
    const noise = random.noise2D(u, v, freq, amp);
    u += noise;
    v += noise;

    //v = v + noise;
    const lerpMargin = margin * 2;

    return {
      position: [
        lerp(lerpMargin, width - lerpMargin, u),
        lerp(lerpMargin, height - lerpMargin, v)
      ],
      //noise
    };
  });

  for (let s = 0; s < stems; s++) {
    let stemLine = [];
    for (let sp = 0; sp < stemPoints; sp++) {
      const point = points1[s*stemPoints + sp].position;
      stemLine.push(point);
    }
    //if (s % 2 === 0) {
    //    stemLine.reverse();
    //}
    lines.push(stemLine);
  }

  var startX = 1 - startX;
  var startY = 1 - startY;
  var startAngle = startAngle + 180;
  var leg_size = -1* leg_size;

  const points = createTriangle(stems, stemPoints,startX,startY, startAngle ,angle,leg_size).map(point => {
    var [u, v] = point;
    
    //var noise = ((cols-1)*u)%2 == 1 ? amp : 0;
    const noise = random.noise2D(u, v, freq, amp);
    u += noise;
    v += noise;

    //v = v + noise;
    const lerpMargin = margin * 2;

    return {
      position: [
        lerp(lerpMargin, width - lerpMargin, u),
        lerp(lerpMargin, height - lerpMargin, v)
      ],
      //noise
    };
  });

  for (let s = 0; s < stems; s++) {
    let stemLine = [];
    for (let sp = 0; sp < stemPoints; sp++) {
      const point = points[s*stemPoints + sp].position;
      stemLine.push(point);
    }
    //if (s % 2 === 0) {
    //    stemLine.reverse();
    //}
    lines.push(stemLine);
  }

  // lines = lines.filter(() => random.value() > 0.2);

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.HP7550A);

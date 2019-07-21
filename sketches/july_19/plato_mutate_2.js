uimport canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { createGrid, logSeed, settings } from "../../util";
import { lerp, clamp } from "canvas-sketch-util/math";

const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = Math.min(width, height) * 0.05;

  const cols = 175;
  const rows = Math.round(cols * (height / width));
  const freq = 3;
  const amp = 0.7;
  const clampAt = 1 * amp;

  const points = createGrid(cols, rows).map(point => {
    var [u, v] = point;
    
    const noise = random.noise2D(u, v, freq, amp);
    const posNoise = clamp(noise, -clampAt, clampAt);
    const lerpMargin = margin * 2;

    //  v = (u > (1/3) && u < (2/3) && v > (1/3) && v < (2/3) ? v + 0.01 : v);

    return {
      position: [
        lerp(lerpMargin, width - lerpMargin, u + posNoise * (height/width/30)),
        lerp(lerpMargin, height - lerpMargin, v + posNoise * (width/height/30))
      ],
      noise
    };
  });

  // for (let c = 0; c < cols; c++) {
  //   let columnLine = [];
  //   for (let r = 0; r < rows; r++) {
  //     columnLine.push(points[c * rows + r].position);
  //   }
  //   if (c % 2 === 0) {
  //     columnLine.reverse();
  //   }
  //   lines.push(columnLine);
  // }

  for (let c = 0; c < cols; c++) {
    let rowLine = [];
    for (let r = 0; r < rows; r++) {
      const point = points[c * rows + r].position;
      rowLine.push(point);
    }
    if (c % 2 === 0) {
      rowLine.reverse();
    }
    lines.push(rowLine);
  }

  // lines = lines.filter(() => random.value() > 0.2);

  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.HP7550A);

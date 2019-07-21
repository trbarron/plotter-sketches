import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { createGrid, createAngledGrid, logSeed, settings, clipPolylinesToOneAnother } from "../../util";
import { lerp, clamp } from "canvas-sketch-util/math";
import convexHull from 'convex-hull';

var ch = require('convex-hull')


const sketch = ({ width, height }) => {
  logSeed();

  let lines = [];
  const margin = 0;

  const cols = 1600;
  const rows = 160;
  const freq = 0.69;
  const amp = 0.9;
  const gridAngle = 0.15;
  const yOverflow = 300;
  const xOverflow = 1600;
  const filterRate = 10000000;

  const points = createAngledGrid(cols, rows,gridAngle,xOverflow,yOverflow).map(point => {
    var [u, v] = point;
    
    var noise = ((cols-1)*u)%2 == 1 ? amp : 0;

    const noiseX =  random.noise2D(u, v, freq, amp);
    const noiseY =  random.noise2D(u, v, freq, amp);


    u = u + noiseX * noiseX;
    v = v + noiseY * noiseY;

    return {
      position: [
        lerp(0, width, u),
        lerp(0, height, v)
      ],
      noise
    };
  });
  
  for (let r = 0; r < rows + yOverflow; r++) {
    let rowLine = [];
    for (let c = 0; c < cols + xOverflow; c++) {
      const point = points[c * (rows + yOverflow) + r].position;
      rowLine.push(point);
    }
    if (r % 2 === 0) {
      rowLine.reverse();
    }
    lines.push(rowLine);    
  }

  const box = [0, 0, width, height];
  lines = clipPolylinesToBox(lines, box);

  lines = clipPolylinesToOneAnother(lines,6000,0,width,true);

  return props => renderPolylines(lines, props);
};


canvasSketch(sketch, settings.HP7550A_p);

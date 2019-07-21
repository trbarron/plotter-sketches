function createArc(
  x1,
  y1,
  x2,
  y2,
  steps = 30,
  finalStep = steps
) {
  let arcLine = [];
  const theta = (Math.PI * 2) / steps;
  for (let i = 0; i <= finalStep; i++) {
    const point = [x1 + ((finalStep-i)/finalStep)* (x2-x1), y1 + ((finalStep-i)/finalStep)* (y2-y1)];
    arcLine.push(point);
  }
  return arcLine;
}

export default createArc;

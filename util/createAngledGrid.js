function createAngledGrid(xCount, yCount,slope, xOverflow,yOverflow) {
  const points = [];
  for (let x = 0; x < xCount + xOverflow; x++) {
    for (let y = 0; y < yCount + yOverflow; y++) {
      const u = xCount <= 1 ? 0.5 : (x-xOverflow/2) / (xCount - 1);
      const v = yCount <= 1 ? 0.5 : ((y-yOverflow/2) / (yCount - 1)) + u*slope ;

      points.push([u, v]);
      
    }
  }
  return points;
}

export default createAngledGrid;

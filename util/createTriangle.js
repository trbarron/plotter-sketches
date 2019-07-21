function createTriangle(stems, stemPoints,startX,startY,startAngle,angle,leg_size) {
  const points = [];
  for (let s = 0; s < stems; s++) {
    for (let sp = 0; sp < stemPoints; sp++) {
      var stemAng = ((s/(stems-1)) * angle - (angle/2) + startAngle) * Math.PI / 180;
      console.log(stemAng -startAngle * Math.PI / 180);
      var stemDist = leg_size * Math.cos(stemAng)
      var stemDist = (sp/(stemPoints-1)) * stemDist;
      const u = startX + Math.cos(stemAng)*stemDist;
      const v = startY + Math.sin(stemAng)*stemDist;
      points.push([u, v]);
    }
  }
  return points;
}

export default createTriangle;

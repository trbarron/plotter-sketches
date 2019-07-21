function clipPolylinesToOneAnother(polylines, bins,minX,maxX,useMaxVal) {
    const binWidth = (maxX - minX) / bins;
    let binMax = []
    let newLines = []

    for (let l = 0; l <= bins; l++) {
        binMax.push(99999);
        }
    for (let l = polylines.length-1; l >= 0 ; l--) {
        var line = polylines[l];
        var nline = line;
        var toDelete = [];

        for (let se = 0; se < line.length-1; se++) {
            var seg = line[se];
            var closestBin = (Math.round(seg[0] / binWidth))
            if (seg[1] < binMax[closestBin])
            {
                binMax[closestBin] = seg[1];
            } else {
                toDelete.push(se);

            }

        }
        if (toDelete.length > 0) {
            if (toDelete[0] != 0) newLines.push(line.slice(0,toDelete[0]));

            for (let c = 1; c < toDelete.length -3; c++) {
                newLines.push(line.slice(toDelete[c-1]+1,toDelete[c]-1));
            }
            newLines.push(line.slice(toDelete[toDelete.length-1]+1,line.length));
        }
        else {
            newLines.push(line);
        }



    }
    return newLines;
}

export default clipPolylinesToOneAnother;
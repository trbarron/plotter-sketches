import { PaperSize, Orientation } from 'canvas-sketch-util';
import newArray from 'new-array';
const clustering = require('density-clustering');
const convexHull = require('convex-hull');
import canvasSketch from "canvas-sketch";
import { logSeed, settings } from "../../util";

var debug = true;

const sketch = ({ width, height, units, render }) => {
    // A large point count will produce more defined results
    const pointCount = 35000;
    let points = Array.from(new Array(pointCount)).map(() => {
      const margin = 2;
      return [
        margin + Math.random()* (width - margin),
        margin + Math.random()* (height - margin)
      ];
    });
  
    // We will add to this over time
    const lines = [];
  
    // The N value for k-means clustering
    // Lower values will produce bigger chunks
    const clusterCount = 3;
  
    // Thickness of pen in cm
    const penThickness = 1;
  
    // Run at 30 FPS until we run out of points
    let loop = setInterval(() => {
      const remaining = integrate();
      if (!remaining) return clearInterval(loop);
      render();
    }, 1000 / 100);
  
    return ({ context }) => {
      // Clear canvas
      context.clearRect(0, 0, width, height);
  
      // Fill with white
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
  
      // Draw lines
      lines.forEach(points => {
        context.beginPath();
        points.forEach(p => context.lineTo(p[0], p[1]));
        context.strokeStyle = debug ? 'blue' : 'black';
        context.lineWidth = penThickness;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.stroke();
      });
  
      // Turn on debugging if you want to see the points
      if (debug) {
        points.forEach(p => {
          context.beginPath();
          context.arc(p[0], p[1], 0.02, 0, Math.PI * 2);
          context.strokeStyle = context.fillStyle = 'red';
          context.lineWidth = penThickness;
          context.fill();
        });
      }
  
      return
    };
  
    function integrate () {
      // Not enough points in our data set
      if (points.length <= clusterCount) return false;
  
      // k-means cluster our data
      const scan = new clustering.KMEANS();
      const clusters = scan.run(points, clusterCount)
        .filter(c => c.length >= 3);
  
      // Ensure we resulted in some clusters
      if (clusters.length === 0) return;
  
      // Sort clusters by density
      clusters.sort((a, b) => a.length - b.length);
  
      // Select the least dense cluster
      const cluster = clusters[0];
      const positions = cluster.map(i => points[i]);
  
      // Find the hull of the cluster
      const edges = convexHull(positions);
  
      // Ensure the hull is large enough
      if (edges.length <= 2) return;
  
      // Create a closed polyline from the hull
      let path = edges.map(c => positions[c[0]]);
      path.push(path[0]);
  
      // Add to total list of polylines
      lines.push(path);
  
      // Remove those points from our data set
      points = points.filter(p => !positions.includes(p));
  
      return true;
    }
  };
  
  canvasSketch(sketch, settings.HP7550A_p);

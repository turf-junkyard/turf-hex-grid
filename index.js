var polygon = require('turf-polygon');

module.exports = hexgrid;

//Precompute cosines and sines of angles used in hexagon creation
// for performance gain
var cosines = [];
var sines = [];
for (var i = 0; i < 6; i++) {
  var angle = 2 * Math.PI/6 * i;
  cosines.push(Math.cos(angle));
  sines.push(Math.sin(angle));
}

//Center should be [x, y]
function hexagon(center, radius) {
  var vertices = [];

  for (var i = 0; i < 6; i++) {
    var x = center[0] + radius * cosines[i];
    var y = center[1] + radius * sines[i];

    vertices.push([x,y]);
  }

  //first and last vertex must be the same
  vertices.push(vertices[0]);

  return polygon([vertices]);
}

// Creates a FeatureCollection of flat-topped
// hexagons aligned in an "odd-q" vertical grid as
// described on http://www.redblobgames.com/grids/hexagons/
//
// bbox: [xmin, ymin, xmax, ymax]
// radius: distance from hex center to vertex (in degrees)
// done: node-style callback (optional)
//
// Returns a GeoJSON FeatureCollection of tessellated hexagons
// that cover the given bbox
function hexgrid(bbox, radius, done) {
  var xmin = bbox[0];
  var ymin = bbox[1];
  var xmax = bbox[2];
  var ymax = bbox[3];

  var fc = {
    type: 'FeatureCollection',
    features: []
  };

  var hex_width = radius * 2;
  var hex_height = Math.sqrt(3)/2 * hex_width;
  
  var box_width = xmax - xmin;
  var box_height = ymax - ymin;

  var x_interval = 3/4 * hex_width;
  var y_interval = hex_height;

  var x_count = Math.ceil(box_width / (hex_width - radius/2));
  if (box_width % (hex_width - radius/2) === 0) {
    x_count++;
  }
  
  var x_adjust = ((x_count * x_interval - radius/2) - box_width)/2 - radius/2;

  var y_count = Math.ceil(box_height / hex_height);

  var y_adjust = (box_height - y_count * hex_height)/2;

  var hasOffsetY = y_count * hex_height - box_height > hex_height/2;
  if (hasOffsetY) {
    y_adjust -= hex_height/4;
  }

  for (var x = 0; x < x_count; x++) {
    for (var y = 0; y <= y_count; y++) {
    
      var isOdd = x % 2 === 1;
      if (y === 0 && isOdd) {
        continue;
      }

      if (y === 0 && hasOffsetY) {
        continue;
      }

      var center_x = x * x_interval + xmin - x_adjust;
      var center_y = y * y_interval + ymin + y_adjust;
      
      if (isOdd) {
        center_y -= hex_height/2;
      }

      fc.features.push(hexagon([center_x, center_y], radius));
    }
  }

  done = done || function () {};
  done(null, fc);

  return fc;
}

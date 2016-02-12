var point = require('turf-point');
var polygon = require('turf-polygon');
var distance = require('turf-distance');
var featurecollection = require('turf-featurecollection');

/**
 * Takes a bounding box and a cell size in degrees and returns a {@link FeatureCollection} of flat-topped
 * hexagons ({@link Polygon} features) aligned in an "odd-q" vertical grid as
 * described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/).
 *
 * @module turf/hex-grid
 * @category interpolation
 * @param {Array<number>} bbox bounding box in [minX, minY, maxX, maxY] order
 * @param {Number} cellWidth width of cell in specified units
 * @param {String} units used in calculating cellWidth ('miles' or 'kilometers')
 * @return {FeatureCollection<Polygon>} a hexagonal grid
 * @example
 * var bbox = [-96,31,-84,40];
 * var cellWidth = 50;
 * var units = 'miles';
 *
 * var hexgrid = turf.hexGrid(bbox, cellWidth, units);
 *
 * //=hexgrid
 */

//Precompute cosines and sines of angles used in hexagon creation
// for performance gain
var cosines = [];
var sines = [];
for (var i = 0; i < 6; i++) {
  var angle = 2 * Math.PI / 6 * i;
  cosines.push(Math.cos(angle));
  sines.push(Math.sin(angle));
}

module.exports = function hexgrid(bbox, cell, units) {
  var xFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
  var cellWidth = xFraction * (bbox[2] - bbox[0]);
  var yFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
  var cellHeight = yFraction * (bbox[3] - bbox[1]);
  var radius = cellWidth / 2;

  var hexWidth = radius * 2;
  var hexHeight = Math.sqrt(3) / 2 * cellHeight;

  var boxWidth = bbox[2] - bbox[0];
  var boxHeight = bbox[3] - bbox[1];

  var xInterval = 3 / 4 * hexWidth;
  var yInterval = hexHeight;

  var xSpan = boxWidth / (hexWidth - radius / 2);
  var xCount = Math.ceil(xSpan);
  if (Math.round(xSpan) === xCount) {
    xCount++;
  }

  var xAdjust = ((xCount * xInterval - radius / 2) - boxWidth) / 2 - radius / 2;

  var yCount = Math.ceil(boxHeight / hexHeight);

  var yAdjust = (boxHeight - yCount * hexHeight) / 2;

  var hasOffsetY = yCount * hexHeight - boxHeight > hexHeight / 2;
  if (hasOffsetY) {
    yAdjust -= hexHeight / 4;
  }

  var fc = featurecollection([]);
  for (var x = 0; x < xCount; x++) {
    for (var y = 0; y <= yCount; y++) {

      var isOdd = x % 2 === 1;
      if (y === 0 && isOdd) {
        continue;
      }

      if (y === 0 && hasOffsetY) {
        continue;
      }

      var centerX = x * xInterval + bbox[0] - xAdjust;
      var centerY = y * yInterval + bbox[1] + yAdjust;

      if (isOdd) {
        centerY -= hexHeight / 2;
      }
      fc.features.push(hexagon([centerX, centerY], cellWidth / 2, cellHeight / 2));
    }
  }

  return fc;
};

//Center should be [x, y]
function hexagon(center, rx, ry) {
  var vertices = [];
  for (var i = 0; i < 6; i++) {
    var x = center[0] + rx * cosines[i];
    var y = center[1] + ry * sines[i];
    vertices.push([x, y]);
  }
  //first and last vertex must be the same
  vertices.push(vertices[0]);
  return polygon([vertices]);
}

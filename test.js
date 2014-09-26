var test = require('tape');
var fs = require('fs');
var inside = require('turf-inside');
var explode = require('turf-explode');
var bboxPolygon = require('turf-bbox-polygon');
var extent = require('turf-extent');
var hex = require('./');

test('hex', function(t) {

  var testBoxes = [
    [0,0,3,3],
    [-2,-2,4,2],
    [1,1,4,4]
  ];

  var testRadii = [1, 0.6, 1.2];

  testBoxes.forEach(function (bbox, i) {
    var radius = testRadii[i];
    var hexgrid = hex(bbox, radius);

    t.ok(hexgrid, 'should create a hexgrid as a Polygon FeatureCollection');
    t.equal(hexgrid.type, 'FeatureCollection');
    t.equal(hexgrid.features[0].geometry.type, 'Polygon');

    var hexExtent = extent(hexgrid);
    hexExtent[0] += radius/2; //adjust for leftmost hex vertex
    hexExtent[2] -= radius/2; //adjust for rightmost hex vertex
    var hexPoly = bboxPolygon(hexExtent);
    var bboxPoly = bboxPolygon(bbox);
    var bboxVertices = explode(bboxPoly);

    bboxVertices.features.forEach(function (vertex) {
      if (!inside(vertex, hexPoly)) {
        t.fail('vertex outside of bbox');
      }
    });

    fs.writeFileSync(__dirname+'/geojson/hex' + i + '.geojson',
      JSON.stringify(hexgrid));

  });


  t.end();
});
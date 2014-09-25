var test = require('tape');
var fs = require('fs');
var hex = require('./');

test('hex', function(t) {
  var hexgrid = hex([0,0,3,3], 1);

  t.ok(hexgrid, 'should create a hexgrid as a Polygon FeatureCollection');
  t.equal(hexgrid.type, 'FeatureCollection');
  t.equal(hexgrid.features[0].geometry.type, 'Polygon');
  t.equal(hexgrid.features.length, 8);
  fs.writeFileSync(__dirname+'/geojson/hex1.geojson', JSON.stringify(hexgrid));

  hexgrid = hex([-2,-2,4,2], 0.6);
  t.ok(hexgrid, 'should work properly with a negative start value');
  t.equal(hexgrid.type, 'FeatureCollection');
  t.equal(hexgrid.features[0].geometry.type, 'Polygon');
  t.equal(hexgrid.features.length, 36);
  fs.writeFileSync(__dirname+'/geojson/hex2.geojson', JSON.stringify(hexgrid));

  t.end();
});
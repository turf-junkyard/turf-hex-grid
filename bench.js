var hex = require('./');
var Benchmark = require('Benchmark');
var fs = require('fs');

var testBoxes = [
    [0,0,3,3],
    [-2,-2,4,2],
    [1,1,4,4]
  ];

  var testRadii = [1, 0.6, 1.2];

var suite = new Benchmark.Suite('turf-hex');
suite
  .add('turf-hex#bbox1',function () {
    hex(testBoxes[0], testRadii[0]);
  })
  .add('turf-hex#bbox2',function () {
    hex(testBoxes[1], testRadii[1]);
  })
  .add('turf-hex#bbox3',function () {
    hex(testBoxes[2], testRadii[2]);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();
# turf-hex

[![build status](https://secure.travis-ci.org/Turfjs/turf-hex.png)](http://travis-ci.org/Turfjs/turf-hex)

turf hex module


### `turf.hex(bbox, size)`

Takes a bounding box and a cell size in degrees and returns a FeatureCollection of flat-topped
hexagons (Polygon features) aligned in an "odd-q" vertical grid as
described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/)


### Parameters

| parameter | type           | description                                    |
| --------- | -------------- | ---------------------------------------------- |
| `bbox`    | Array.<number> | bounding box in [minX, minY, maxX, maxY] order |
| `size`    | Number         | size of cells in degrees                       |


### Example

```js
var bbox = [7.2669410, 43.695307, 7.2862529, 43.706476];
var size = 0.001;

var hexgrid = turf.hex(bbox, size);

//=hexgrid
```

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-hex
```

## Tests

```sh
$ npm test
```


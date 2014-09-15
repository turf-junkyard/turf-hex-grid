turf-hex
========
[![Build Status](https://travis-ci.org/Turfjs/turf-hex.svg?branch=master)](https://travis-ci.org/Turfjs/turf-hex)

Generates a hexgrid within the specified bbox.

###Install

```sh
npm install turf-hex
```

###Parameters

name|description
---|---
bbox|[minX, minY, maxX, maxY]
size|size of cells in degrees

###Usage

```js
hex(bbox, distance)
```

###Example

```js
var hex = require('turf-hex');

var hexgrid = hex([0,0,10,10], 1)
```
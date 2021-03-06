# gcode-interpreter [![build status](https://travis-ci.org/cheton/gcode-interpreter.svg?branch=master)](https://travis-ci.org/cheton/gcode-interpreter) [![Coverage Status](https://coveralls.io/repos/cheton/gcode-interpreter/badge.svg?branch=master&service=github)](https://coveralls.io/github/cheton/gcode-interpreter?branch=master)

[![NPM](https://nodei.co/npm/gcode-interpreter.png?downloads=true&stars=true)](https://www.npmjs.com/package/gcode-interpreter)

## Install

`npm install --save gcode-interpreter`

## Usage

```js
var GCodeInterpreter = require('gcode-interpreter').GCodeInterpreter;

var GCodeRunner = function() {
    var handlers = {
        'G0': (args) => {
            console.log('G0', args);
        },
        'G1': (args) => {
            console.log('G1', args);
        }
    };

    return new GCodeInterpreter({ handlers: handlers })
};

var runner = new GCodeRunner()

// Load G-code from stream
var stream = fs.createReadStream(file, { encoding: 'utf8' });
runner.loadFromStream(stream, function(err, data) {
});

// loadFromFile
var file = 'example.nc';
runner.loadFromFile(file, function(err, data) {
});

// Synchronous version of loadFromFile
var data = runner.loadFromFileSync(file);

// loadFromString
runner.loadFromString(fs.readFileSync(file, 'utf8'), function(err, data) {
});

// Synchronous version of loadFromString
var data = runner.loadFromStringSync(file);
```

## Examples

Run this example with babel-node:
```js
import { GCodeInterpreter } from 'gcode-interpreter';

const GCODE = [
    'N1 G17 G20 G90 G94 G54',
    'N2 G0 Z0.25',
    'N3 X-0.5 Y0.',
    'N4 Z0.1',
    'N5 G01 Z0. F5.',
    'N6 G02 X0. Y0.5 I0.5 J0. F2.5',
    'N7 X0.5 Y0. I0. J-0.5',
    'N8 X0. Y-0.5 I-0.5 J0.',
    'N9 X-0.5 Y0. I0. J0.5',
    'N10 G01 Z0.1 F5.',
    'N11 G00 X0. Y0. Z0.25'
].join('\n');

class GCodeToolpath {
    handlers = {
        'G0': (params) => {
            console.log('G0', params);
        },
        'G1': (params) => {
            console.log('G1', params);
        },
        'G2': (params) => {
            console.log('G2', params);
        },
        'G17': (params) => {
            console.log('G17');
        },
        'G20': (params) => {
            console.log('G20');
        },
        'G90': (params) => {
            console.log('G90');
        },
        'G94': (params) => {
            console.log('G94');
        },
        'G54': (params) => {
            console.log('G54');
        }
    };

    constructor(options) {
        options = options || {};

        return new GCodeInterpreter({ handlers: this.handlers });
    }
}

const toolpath = new GCodeToolpath();

toolpath
    .loadFromString(GCODE, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
    })
    .on('data', (data) => {
        // 'data' event listener
    })
    .on('end', (results) => {
        // 'end' event listener
    });
```

and you will see the output as below:
```
G17
G20
G90
G94
G54
G0 { Z: 0.25 }
G0 { X: -0.5, Y: 0 }
G0 { Z: 0.1 }
G1 { Z: 0, F: 5 }
G2 { X: 0, Y: 0.5, I: 0.5, J: 0, F: 2.5 }
G2 { X: 0.5, Y: 0, I: 0, J: -0.5 }
G2 { X: 0, Y: -0.5, I: -0.5, J: 0 }
G2 { X: -0.5, Y: 0, I: 0, J: 0.5 }
G1 { Z: 0.1, F: 5 }
G0 { X: 0, Y: 0, Z: 0.25 }
```

## G-code Toolpath
https://github.com/cheton/gcode-toolpath

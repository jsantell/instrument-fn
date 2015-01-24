# instrument-fn

[![Build Status](http://img.shields.io/travis/jsantell/instrument-fn.svg?style=flat-square)](https://travis-ci.org/jsantell/instrument-fn)
[![Build Status](http://img.shields.io/npm/v/instrument-fn.svg?style=flat-square)](https://www.npmjs.org/package/instrument-fn)


Instrument functions with a wrapper, exposing caller, arguments, result and method name called.

## Installation

`$ npm install instrument-fn`

## API

### instrument(obj, wrapperFn, methods)

Wraps `obj` methods with `wrapperFn`. Calling a instrumented method calls the `wrapperFn`, passing in an object with `caller`, `args`, `name` and `result` properties as a single argument. Only instruments method names defined in the array of strings `methods`, or if undefined, all enumerable functions on `obj`.

## Example

```js
var instrument = require("instrument-fn");

function User () {}
User.prototype.setName = function (name) { this.name = name; }
User.prototype.getName = function () { return this.name; }

// Instrument the two functions on the User prototype.
instrument(User.prototype, wrapper, ["setName", "getName"]);

var user = new User();

user.setName("freyja");
// Calls `wrapper` with `caller === user`, `args[0] === "freyja"`,
// `result === undefined` and `name === "setName"`

user.getName();
// Calls `wrapper` with `caller === user`, `args` as an empty array,
// `result === "freyja"` and `name === "getName"`

function wrapper ({ caller, args, result, name }) {
}
```

## Testing

`npm test`

## License

MIT License, Copyright (c) 2015 Jordan Santell

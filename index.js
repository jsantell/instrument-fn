/**
 * Expose instrument function
 */

module.exports = instrument;

/**
 * Instrumentation function, wrapping function calls
 * in `obj` with the function `wrapperFn`. If `methods`
 * defined, only instruments those methods on `obj`. Otherwise,
 * instrument all enumerable methods on `obj`.
 *
 * @param {Object} obj
 * @param {Function} wrapperFn
 * @param {Array} methods
 */

function instrument (obj, wrapperFn, methods) {
  methods = methods || Object.keys(obj);

  methods.forEach(function (method) {
    var originalFn = obj[method];

    if (typeof originalFn !== "function") {
      return;
    }

    obj[method] = function () {
      var result = originalFn.apply(this, arguments);
      var data = {
        caller: this,
        name: method,
        args: arguments,
        result: result
      };
      wrapperFn(data);
    };
  });
}

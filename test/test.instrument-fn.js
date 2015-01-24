var expect = require("chai").expect;
var instrument = require("..");

function createObj () {
  function User () {}
  User.prototype.name = null;
  User.prototype.setName = function (name) { this.name = name; }
  User.prototype.getName = function () { return this.name; }
  return User;
}

describe("instrument-fn", function () {
  it("instruments only defined methods", function () {
    var called = 0;
    var wrapper = function (data) {
      expect(data.name).to.be.equal("setName");
      called++;
    };
    var User = createObj();
    instrument(User.prototype, wrapper, ["setName"]);
    var user = new User();
    user.setName("j");
    user.getName();
    expect(called).to.be.equal(1);
  });

  it("instruments all enumerable functions", function () {
    var called = 0;
    var wrapper = function (data) {
      if (called++) {
        expect(data.name).to.be.equal("getName");
      } else {
        expect(data.name).to.be.equal("setName");
      }
    };
    var User = createObj();
    instrument(User.prototype, wrapper);
    var user = new User();
    user.setName("j");
    user.getName();
    expect(called).to.be.equal(2);
  });

  it("exposes `caller` in wrapper function", function (done) {
    var wrapper = function (data) {
      expect(data.caller).to.be.equal(user);
      done();
    };
    var User = createObj();
    instrument(User.prototype, wrapper);
    var user = new User();
    user.setName("j");
  });

  it("exposes `args` in wrapper function", function (done) {
    var wrapper = function (data) {
      expect(data.args[0]).to.be.equal("j");
      done();
    };
    var User = createObj();
    instrument(User.prototype, wrapper);
    var user = new User();
    user.setName("j");
  });

  it("exposes `result` in wrapper function", function (done) {
    var wrapper = function (data) {
      expect(data.result).to.be.equal("j");
      done();
    };
    var User = createObj();
    instrument(User.prototype, wrapper);
    var user = new User();
    user.name = "j";
    user.getName();
  });

  it("exposes `name` in wrapper function", function (done) {
    var wrapper = function (data) {
      expect(data.name).to.be.equal("setName");
      done();
    };
    var User = createObj();
    instrument(User.prototype, wrapper);
    var user = new User();
    user.setName("j");
  });

  it("returns the original return value", function () {
    var User = createObj();
    instrument(User.prototype, function () {});
    var user = new User();
    user.setName("j");
    var ret = user.getName();
    expect(ret).to.be.equal("j");
  });
});

var assert = require("assert");
var RingBuffer = require("../src/ring-buffer");

var identity = function (element) {
  return element
};
var appendX = function (element) {
  return element + 'x';
};

describe('RingBuffer with zero length', function() {
  it('should not be created', function() {
    assert.throws(function() {
      new RingBuffer(0);
    })
  })
});

describe('RingBuffer with negative length', function() {
  it('should not be created', function() {
    assert.throws(function() {
      new RingBuffer(-1);
    })
  })
});

describe('Empty RingBuffer', function() {
  var ringBuffer1 = new RingBuffer(1);
  var ringBuffer10 = new RingBuffer(10);

  it('map should return empty array', function() {
    assert.deepEqual(ringBuffer1.map(identity), []);
    assert.deepEqual(ringBuffer10.map(identity), []);
    assert.deepEqual(ringBuffer1.map(appendX), []);
    assert.deepEqual(ringBuffer10.map(appendX), []);
  })
});

describe('RingBuffer containing a single element', function() {
  var ringBuffer1 = new RingBuffer(1);
  var ringBuffer10 = new RingBuffer(10);

  // TODO How is before() different to running code at beginning of describe? Deferred?
  before(function() {
    ringBuffer1.push('a');
    ringBuffer10.push('b');
  });

  it('identity map should return array containing element', function () {
    assert.deepEqual(ringBuffer1.map(identity), ['a']);
    assert.deepEqual(ringBuffer10.map(identity), ['b']);
  });

  it('appendX map should return array containing element with x appended', function () {
    assert.deepEqual(ringBuffer1.map(appendX), ['ax']);
    assert.deepEqual(ringBuffer10.map(appendX), ['bx']);
  })
});

describe('RingBuffer containing multiple elements', function() {
  var ringBuffer10 = new RingBuffer(10);

  before(function (){
    ringBuffer10.push('c');
    ringBuffer10.push('d');
    ringBuffer10.push('e');
  });

  it('identity map should return array containing those elements', function() {
    assert.deepEqual(ringBuffer10.map(identity), ['e', 'd', 'c']);
  });

  it('appendX map should return array containing those elements with x appended', function () {
    assert.deepEqual(ringBuffer10.map(appendX), ['ex', 'dx', 'cx']);
  })
});

describe('Full RingBuffer', function() {
  var ringBuffer10 = new RingBuffer(10);

  before(function (){
    ringBuffer10.push('f');
    ringBuffer10.push('g');
    ringBuffer10.push('h');
    ringBuffer10.push('i');
    ringBuffer10.push('j');
    ringBuffer10.push('k');
    ringBuffer10.push('l');
    ringBuffer10.push('m');
    ringBuffer10.push('n');
    ringBuffer10.push('o');
  });

  it('identity map should return array containing all elements', function() {
    assert.deepEqual(ringBuffer10.map(identity), ['o', 'n', 'm', 'l', 'k', 'j', 'i', 'h', 'g', 'f']);
  });

  it('appendX map should return array containing all elements with x appended', function () {
    assert.deepEqual(ringBuffer10.map(appendX), ['ox', 'nx', 'mx', 'lx', 'kx', 'jx', 'ix', 'hx', 'gx', 'fx']);
  })
});

describe('Wrapped around RingBuffer', function() {
  var ringBuffer10 = new RingBuffer(10);

  before(function (){
    ringBuffer10.push('p');
    ringBuffer10.push('q');
    ringBuffer10.push('r');
    ringBuffer10.push('s');
    ringBuffer10.push('t');
    ringBuffer10.push('u');
    ringBuffer10.push('v');
    ringBuffer10.push('w');
    ringBuffer10.push('x');
    ringBuffer10.push('y');
    ringBuffer10.push('z');
    ringBuffer10.push('a');
    ringBuffer10.push('b');
  });

  it('identity map should return array containing most recent elements', function() {
    assert.deepEqual(ringBuffer10.map(identity), ['b', 'a', 'z', 'y', 'x', 'w', 'v', 'u', 't', 's']);
  });

  it('appendX map should return array containing most recent elements with x appended', function () {
    assert.deepEqual(ringBuffer10.map(appendX), ['bx', 'ax', 'zx', 'yx', 'xx', 'wx', 'vx', 'ux', 'tx', 'sx']);
  })
});

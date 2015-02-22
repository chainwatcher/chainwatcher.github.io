var RingBuffer = function(length) {
  var pointer = 0;
  var buffer = [];

  return {
    get: function(key) {
      return buffer[(pointer + key) % length];
    },
    push: function(item) {
      buffer[pointer] = item;
      pointer = (pointer + 1) % length;
    },
    map: function(callback) {
      var result = new RingBuffer(length);
      for (var i = 0; i < length; i++) {
        result.push(callback.call(this.get(i)));
      }
      return result;
    }
  };
};

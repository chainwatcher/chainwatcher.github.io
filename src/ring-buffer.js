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
      var result = [];
      for (var i = 0; i < length; i++) {
        result[i] = callback.call(this.get(i));
      }
      return result;
    }
  };
};

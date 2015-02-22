var RingBuffer = function(length) {
  var pointer = 0;
  var buffer = [];

  return {
    get: function(key) {
      return buffer[key];
    },
    push: function(item) {
      buffer[pointer] = item;
      pointer = (pointer + 1) % length;
    },
    map: function(callback) {
      buffer.map(callback);
    }
  };
};

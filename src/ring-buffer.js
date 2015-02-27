var RingBuffer = function(length) {
  if (length <= 0) {
    throw new Error('Length of RingBuffer (' + length + ') must be positive.')
  }

  var next = 0;
  var buffer = [];

  function key(index) {
    return (length + index) % length;
  }

  return {
    push: function(item) {
      buffer[next] = item;
      next = key(next + 1);
    },
    map: function(callback) {
      var result = [];
      var limit = key(next - 1);
      var bufferIndex = limit;
      do {
        if (buffer[bufferIndex] !== undefined) {
          result.push(callback.call(null, buffer[bufferIndex]));
        }
        bufferIndex = key(bufferIndex - 1);
      } while (bufferIndex !== limit);
      return result;
    }
  };
};

if (typeof module === 'object') {
  module.exports = RingBuffer;
}

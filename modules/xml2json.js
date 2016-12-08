var definitions = require('./definitions'),
  coreParser = require('./coreParser'),
  q = require('q');

module.exports = function (instrument) {
  var instr = definitions(instrument);
  return {
    write: function (data) {
      var deferred = q.defer(), self = this;
      setTimeout(function () {
        try {
          self.parser.write(data);
          deferred.resolve(instr.data())
        } catch (error) {
          deferred.reject(error);
        }
      });
      return deferred.promise;
    },
    end: function () {
      this.parser.end();
    },
    parser: coreParser(instr.events)
  };
};
var definitions = require('./definitions'),
  coreParser = require('./coreParser');

module.exports = function (instrument) {
  var ret = {
    write: function (data) {
      this.parser.write(data);
    },
    end: function () {
      this.parser.end();
    }
  };
  
  ret.parser = coreParser(definitions.call(ret, instrument).events);
  return ret;
};
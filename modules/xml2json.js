var definitions = require('./definitions'),
  coreParser = require('./coreParser');

module.exports = function (instrument) {
  var ret = {
    cdtTrfTxInf: [],
    pmtInf: [],
    control: {
      grpHdr: {
        importing: false,
        nbOfTxs: undefined,
        ctrlSum: undefined
      },
      pmtInf: {
        cnt: 0,
        sum: 0
      },
      reset: function () {
        this.grpHdr.ctrlSum = undefined;
        this.grpHdr.nbOfTxs = undefined;
        this.pmtInf.cnt = 0;
        this.pmtInf.sum = 0;
      },
      check: function () {
        return (typeof this.grpHdr.nbOfTxs === "undefined" || parseInt(this.grpHdr.nbOfTxs) === this.pmtInf.cnt)
          && (typeof this.grpHdr.ctrlSum === "undefined" || parseFloat(this.grpHdr.ctrlSum) === this.pmtInf.sum)
      }
    },
    parser: coreParser(),
    write: function (data) {
      this.parser.write(data);
    },
    end: function () {
      this.parser.end();
    }
  };

  var def  = definitions.call(ret, instrument);

  ret.parser.eventsCbs(def.events);
  return ret;
};
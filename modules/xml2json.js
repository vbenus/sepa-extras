var definitions = require('./definitions');

module.exports = function (instrument) {
  var ret = {
    cdtTrfTxInf: [],
    drctDbtTxInf: [],
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
    parser: saxParser(),
    write: function (data) {
      var self = this, deferred = $q.defer();
      this.pmtInf = [];
      $timeout(function () {
        try {
          self.parser.write(data);
          deferred.resolve(self.pmtInf);
        } catch (e) {
          deferred.reject(e);
        }
      });
      return deferred.promise;
    },
    end: function () {
      this.parser.end();
    }
  };
  ret.parser.eventsCbs(events.call(ret, instrument));
  return ret;
};
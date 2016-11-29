function onText() {
  var self = this;
  return function (tagName, text) {
    if (self.control.grpHdr.importing) {
      if (tagName === "CtrlSum")
        self.control.grpHdr.ctrlSum = text;
      if (tagName === "NbOfTxs")
        self.control.grpHdr.nbOfTxs = text;
    }
  }
}

function onOpenTag() {
  var self = this;
  return function (tag, obj) {
    if (tag === "GrpHdr") {
      self.control.grpHdr.importing = true;
    }
  }
}

var sct = function () {
  var self = this;
  return {
    events: {
      "onText": onText.call(self),
      "onOpenTag": onOpenTag.call(self),
      "onCloseTag": function (tag, obj) {
        if (tag === "GrpHdr") {
          self.control.grpHdr.importing = false;
        }

        if (tag === "CdtTrfTxInf") {
          self.cdtTrfTxInf.push(obj.Document.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf);
          delete obj.Document.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf;
          if (obj.Document.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf)
            throw "Chyba - CdtTrfTxInf";
        }

        if (tag === "PmtInf") {
          obj.Document.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf = self.cdtTrfTxInf;

          obj.Document.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.forEach(function (txn) {
            self.control.pmtInf.cnt++;
            self.control.pmtInf.sum = parseFloat((self.control.pmtInf.sum + parseFloat(txn.Amt.InstdAmt._)).toFixed(2));
          });

          self.pmtInf.push(obj.Document.CstmrCdtTrfInitn.PmtInf);
          self.cdtTrfTxInf = [];
          delete obj.Document.CstmrCdtTrfInitn.PmtInf;
          if (obj.Document.CstmrCdtTrfInitn.PmtInf)
            throw "Chyba - PmtInf";
        }

        if (tag === "CstmrCdtTrfInitn") {
          obj.Document.CstmrCdtTrfInitn.PmtInf = self.pmtInf;

          if (!self.control.check())
            throw "Expected control sum " + self.control.grpHdr.ctrlSum + "=" + self.control.pmtInf.sum + " or quantity of payments " + self.control.grpHdr.nbOfTxs + "=" + self.control.pmtInf.cnt;
          self.control.reset();

          delete obj.Document.CstmrCdtTrfInitn;
          if (obj.Document.CstmrCdtTrfInitn)
            throw "Chyba - CstmrCdtTrfInitn";
        }
      }
    }
  }
};

module.exports = function (instrument) {
  switch (instrument) {
    case "SCT":
    {
      return sct.call(this);
    }
    default:
      throw new Error("Unknown instrument: " + instrument);
  }
};

//
// exports.sdd = {
//   "onText": onText,
//   "onOpenTag": onOpenTag,
//   "onCloseTag": function (tag, obj) {
//     if (tag === "GrpHdr") {
//       self.control.grpHdr.importing = false;
//     }
//
//     if (tag === "DrctDbtTxInf") {
//       self.drctDbtTxInf.push(obj.Document.CstmrDrctDbtInitn.PmtInf.DrctDbtTxInf);
//       delete obj.Document.CstmrDrctDbtInitn.PmtInf.DrctDbtTxInf;
//       if (obj.Document.CstmrDrctDbtInitn.PmtInf.DrctDbtTxInf)
//         throw "Error - DrctDbtTxInf";
//     }
//
//     if (tag === "PmtInf") {
//       obj.Document.CstmrDrctDbtInitn.PmtInf.DrctDbtTxInf = self.drctDbtTxInf;
//
//       obj.Document.CstmrDrctDbtInitn.PmtInf.DrctDbtTxInf.forEach(function (txn) {
//         self.control.pmtInf.cnt++;
//         self.control.pmtInf.sum = parseFloat((self.control.pmtInf.sum + parseFloat(txn.InstdAmt._)).toFixed(2));
//       });
//
//       self.pmtInf.push(obj.Document.CstmrDrctDbtInitn.PmtInf);
//       self.drctDbtTxInf = [];
//       delete obj.Document.CstmrDrctDbtInitn.PmtInf;
//       if (obj.Document.CstmrDrctDbtInitn.PmtInf)
//         throw "Chyba - PmtInf";
//     }
//
//     if (tag === "CstmrDrctDbtInitn") {
//       obj.Document.CstmrDrctDbtInitn.PmtInf = self.pmtInf;
//
//       if (!self.control.check())
//         throw "Expected control sum " + self.control.grpHdr.ctrlSum + "=" + self.control.pmtInf.sum + " or quantity of payments " + self.control.grpHdr.nbOfTxs + "=" + self.control.pmtInf.cnt;
//       self.control.reset();
//
//       delete obj.Document.CstmrDrctDbtInitn;
//       if (obj.Document.CstmrDrctDbtInitn)
//         throw "Chyba - CstmrDrctDbtInitn";
//     }
//   }
// };
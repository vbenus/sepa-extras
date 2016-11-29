var sax = require('sax');

var addEvents = function () {
  var self = this;
  this.parser.ontext = function (text) {
    if (this.tags.length) {
      if (this.tags[this.tags.length - 1].name != this.tagName) {
        self.setObject(this.tags, this.tagName, text);
      }
    }

    if (self.events.onText)
      self.events.onText(this.tagName, text);
  };
  this.parser.onopentag = function (tag) {
  //  console.log(tag);
    if (self.events.onOpenTag)
      self.events.onOpenTag(tag.name, self.obj);
  };
  this.parser.onerror = function (e) {
    throw e;
  };
  this.parser.onattribute = function (attr) {
    if (attr.name.substring(0, 5) != 'xmlns') {
      var parent = self.getParent(this.tags) + this.tagName;
      if (!self.attrs[parent]) {
        self.attrs[parent] = [];
      }
      self.attrs[parent].push(attr);
    }
  };
  this.parser.onclosetag = function (tag) {
    if (self.attrs) {
      var parent = self.getParent(this.tags) + this.tagName;
      if (self.attrs[parent]) {
        self.setObject(this.tags, tag, self.attrs[parent]);
        delete self.attrs[parent];
      }
    }

    if (self.events.onCloseTag)
      self.events.onCloseTag(tag, self.obj);
  };
  this.parser.onend = function () {
  };
};

module.exports = function () {
  var obj = {
    attrs: [],
    obj: {},
    events: {
      onCloseTag: undefined,
      onOpenTag: undefined,
      onText: undefined
    },
    parser: sax.parser(true, {normalize: true, trim: true}),
    write: function (data) {
      this.parser.write(data)
    },
    setObject: function (arr, tag, data) {
      var len = arr.length;
      var fn = function (obj, idx) {
        if (idx === len) {
          if (data instanceof Object) {
            obj[tag] = {
              "$": data,
              "_": obj[tag]
            }
          } else {
            if (obj[tag]) {
              if (!Array.isArray(obj[tag])) {
                obj[tag] = [obj[tag]];
              }
              obj[tag].push(data);
            } else {
              obj[tag] = data;
            }
          }
          return obj;
        }
        if (!obj[arr[idx].name]) {
          obj[arr[idx].name] = {};
        }
        fn(obj[arr[idx].name], ++idx);
      };
      fn(this.obj, 0);
    },
    getParent: function (arr) {
      return arr.map(function (a) {
        return a.name
      }).join('');
    },
    end: function () {
      this.parser.end();
    },
    eventsCbs: function (cbs) {
      this.events.onCloseTag = cbs.onCloseTag;
      this.events.onOpenTag = cbs.onOpenTag;
      this.events.onText = cbs.onText;
    }
  };

  addEvents.call(obj);
  return obj;
};

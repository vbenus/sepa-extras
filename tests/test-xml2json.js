var expect = require('chai').expect,
  core = require('./../modules/coreParser'),
  fs = require('fs'),
  xml2json = require('./../modules/xml2json');

// describe('core', function() {
//   it('init', function(){
//     var c = core();
//     expect(c).to.be.defined;
//   })
// });

var file = fs.readFileSync('./data/sct.xml', 'utf8');

//var c = core();

//console.log(c.write(file));

var x2j = xml2json("SCT");

console.log(x2j.write(file));
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

var file = fs.readFileSync('./data/sct2.xml', 'utf8');
var sct = xml2json("SCT");
sct.write(file)
  .then((data)=> {
    console.log(data);
  })
  .catch((error)=>{
    console.error(error);
  });

file = fs.readFileSync('./data/sdd.xml', 'utf8');
var sdd = xml2json("SDD");
sdd.write(file)
  .then((data)=> {
    console.log(data);
  });
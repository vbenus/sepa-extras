var expect = require('chai').expect,
  core = require('./../modules/core'),
  fs = require('fs');

describe('core', function() {
  it('init', function(){
    var c = core();
    expect(c).to.be.defined;
  })
});

var file = fs.readFileSync('./data/sct.xml', 'utf8');

var c = core();

console.log(c.write(file));
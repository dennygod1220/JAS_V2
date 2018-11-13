var cheerio = require('cheerio');
var fs = require('fs');

function setDefaultZone(html, path) {
  var $ = cheerio.load(html);

  fs.writeFile(path + '/DefaultZone.html', $.html(), function () {});
}

function SetCusZone(html, path, zone) {
  var $ = cheerio.load(html);

  fs.writeFile(path, $.html(), function () {});
}



module.exports = {
  setDefaultZone: setDefaultZone,
  SetCusZone: SetCusZone
};

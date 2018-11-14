var cheerio = require('cheerio');
var fs = require('fs');

function SetCusZone(html, path, zone) {
  var $ = cheerio.load(html);
  var b = $('.news.boxpadding.noP');
  b.append('<li><div style="width:100%;text-align:center;">' + zone + '</div></li>');
  fs.writeFile(path, $.html(), function () {});
}

function setDefaultZone(html, path) {
  var img_dir = fs.readdirSync(path + '/images/');
  img_dir.forEach(element => {
    fs.renameSync(path + '/images/' + element, path + '/images/' + decodeURIComponent(escape(element)));
  });
  var $ = cheerio.load(html);
  var b = $('.news.boxpadding.noP');
  b.append('<li><div style="width:100%;text-align:center;"><ins class="clickforceads" style="display:inline-block;width:4px;height:4px;" data-ad-zone="8730"></ins><script async type="text/javascript" src="//cdn.doublemax.net/js/init.js"></script></div></li>');
  fs.writeFile(path + '/DefaultZone.html', $.html(), function () {});
}
module.exports = {
  setDefaultZone: setDefaultZone,
  SetCusZone: SetCusZone
};

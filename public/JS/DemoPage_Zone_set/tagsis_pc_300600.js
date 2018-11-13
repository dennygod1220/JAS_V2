var cheerio = require('cheerio');
var fs = require('fs');


function SetCusZone(html,path,zone) {
  var $ = cheerio.load(html);
  var b = $("#right-box > div > div.articles > div.ads-box.center");
  $(b).children().remove();
  $(b).append(zone);
  fs.writeFile(path, $.html(), function () {
      console.log('女生集合 300600 電腦板 自訂版位 OK')
  });
}

function setDefaultZone(html,path) {

  var $ = cheerio.load(html);

  var b = $("#right-box > div > div.articles > div.ads-box.center");
  $(b).children().remove();
  $(b).append('<ins class="clickforceads" style="display:inline-block;width:300px;height:600px;" data-ad-zone="8708"></ins><script async type="text/javascript" src="//cdn.doublemax.net/js/init.js"></script>');
  fs.writeFile(path+'/DefaultZone.html', $.html(), function () {
      console.log('女生集合 300600 電腦板預設版位 OK')
  });

}

module.exports = {
  setDefaultZone: setDefaultZone,
  SetCusZone: SetCusZone
};


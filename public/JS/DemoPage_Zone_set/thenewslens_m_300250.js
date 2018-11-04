var cheerio = require('cheerio');
var fs = require('fs');


function getPlayers() {


}

function setDefaultZone(html,path) {

  var $ = cheerio.load(html);
  $("#div-gpt-ad-1516246245198-3").children().remove();
  $("#div-gpt-ad-1516246245198-3").append('<div style="text-align: center;"><ins class="clickforceads" style="display:inline-block;width:300px;height:250px;" data-ad-zone="8707"></ins><script async type="text/javascript" src="//cdn.doublemax.net/js/init.js"></script></div>');
  fs.writeFile(path+'/DefaultZone.html', $.html(), function () {
      console.log('關鍵評論網 300250 手機板 預設版位 OK')
  });

}

module.exports = {
  setDefaultZone: setDefaultZone,
  getPlayers: getPlayers
};
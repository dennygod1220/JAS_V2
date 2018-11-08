var cheerio = require('cheerio');
var fs = require('fs');


function SetCusZone(html,path,zone) {
  var $ = cheerio.load(html);
  $(".etad").children().remove();
  $(".etad").append('<div style="text-align: center;">'+zone+'</div>');
  fs.writeFile(path+'/DefaultZone.html', $.html(), function () {
    console.log('旅食樂 300250 手機板 自訂版位 OK')
  });

}

function setDefaultZone(html, path) {
  //讓中文圖片url不會變亂碼
  var img_dir = fs.readdirSync(path + '/images/');
  img_dir.forEach(element => {
    // console.log(decodeURIComponent(escape(element)));
    fs.renameSync(path + '/images/' + element, path+ '/images/' + decodeURIComponent(escape(element)));
  });

  var $ = cheerio.load(html);
  $(".etad").children().remove();
  $(".etad").append('<div style="text-align: center;"><ins class="clickforceads" style="display:inline-block;width:300px;height:250px;" data-ad-zone="8707"></ins><script async type="text/javascript" src="//cdn.doublemax.net/js/init.js"></script></div>');
  fs.writeFile(path+'/DefaultZone.html', $.html(), function () {
    console.log('旅食樂 300250 手機板 預設版位 OK')
  });

}

module.exports = {
  setDefaultZone: setDefaultZone,
  SetCusZone: SetCusZone
};
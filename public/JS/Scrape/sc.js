var rimraf = require('rimraf');
var fs = require('fs');
var scrape = require('website-scraper');
var basic_zone = require('../DemoPage_Zone_set/basic_zone');


async function set_option(url, dir, zonesize, phone, modify_name = false) {

  var path_prefix = "public/DemoPage/site";
  var phone = phone;
  //如果該目錄已經存在，先將此目錄刪除
  if (phone == true) {
    //手機板
    if (fs.existsSync(path_prefix + '/phone/' + zonesize + '/' + dir)) {
      console.log(dir + " 刪除");
      rimraf(path_prefix + '/phone/' + zonesize + '/' + dir, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  } else {
    //PC版
    if (fs.existsSync(path_prefix + '/PC/' + zonesize + '/' + dir)) {
      console.log(dir + " 刪除");
      rimraf(path_prefix + '/PC/' + zonesize + '/' + dir, function (err) {
        if (err) console.log(err);
      });
    }
  }
  //呼叫此function 後 會將 options 參數push進options 陣列
  if (phone == true) {
    var a = {
      urls: [url],
      directory: path_prefix + '/phone/' + zonesize + '/' + dir,
      request: {
        headers: {
          'content-type': 'charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
        }
      },
    };
  } else {
    var a = {
      urls: [url],
      directory: path_prefix + '/PC/' + zonesize + '/' + dir,
      request: {
        headers: {
          'content-type': 'charset=UTF-8',
        }
      },
    };
  }
  setTimeout(() => {
    process.setMaxListeners(0);
    console.log(dir + "  開始下載!");

    scrape(a).then((result) => {
      console.log(zonesize + "/" + dir + "下載完成!!");

      basic_zone.modifyhtml(a.directory, modify_name);
    }).catch(console.log);
  }, 1000);
}

module.exports = {
  set_option: set_option
}

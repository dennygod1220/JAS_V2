'use strict'

var scrape = use('website-scraper');
var fs = use('fs');
var path = use("path");
var cron = use('node-cron');
var rimraf = use('rimraf');
var cheerio = use('cheerio');
var basic_zone = require('../../../public/JS/DemoPage_Zone_set/basic_zone');

class CronJobController {
  async index({
    view
  }) {
    return view.render('CronDownloadSite.index');
  }

  async start() {
    console.log("啟動Cron Job");
    // cron.schedule('* 59 * * * *', async () => {
    //新增網站時 格式為
    //   set_option( url, '網站名稱', '廣告大小', 手機=true PC = false , 呼應js名稱);
    await set_option("https://www.thenewslens.com/", '關鍵評論往', '300250', true, "thenewslens_m_300250");
    await set_option("https://www.tagsis.com/", '女生集合', '320480', false);
    await set_option("http://www.clickforce.com.tw/news/index?category=5&lid=28", 'clickforce_demo', '300250', false);
    await set_option("http://play.nownews.com/", '旅食樂', '300250', true , "nownews_m_300250");

    // });

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

  }



}

module.exports = CronJobController

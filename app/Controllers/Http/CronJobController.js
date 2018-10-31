'use strict'

var scrape = use('website-scraper');
var fs = use('fs');
var path = use("path");
var cron = use('node-cron');
var rimraf = use('rimraf');

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
    //   set_option( url, '網站名稱', '廣告大小', 手機=true PC = false);
    await set_option("https://www.thenewslens.com/", 'thenewslens', '300250', true);
    await set_option("https://www.tagsis.com/", 'tagsis2', '320480', false);
    await set_option("http://www.clickforce.com.tw/news/index?category=5&lid=28", 'clickforce_demo', '300250', false);
    // });

    async function set_option(url, dir, zonesize, phone) {
      var path_prefix = "public/DemoPage/site/";
      var phone = phone;
      //如果該目錄已經存在，先將此目錄刪除
      if (phone == true) {
        //手機板
        if (fs.existsSync(path_prefix + dir + '/phone/' + zonesize)) {
          console.log(dir + " 刪除");
          rimraf(path_prefix + dir + '/phone/' + zonesize, function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
      } else {
        //PC版
        if (fs.existsSync(path_prefix + dir + '/' + zonesize)) {
          console.log(dir + " 刪除");
          rimraf(path_prefix + dir + '/' + zonesize, function (err) {
            if (err) console.log(err);
          });
        }
      }
      //呼叫此function 後 會將 options 參數push進options 陣列
      if (phone == true) {
        var a = {
          urls: [url],
          directory: path_prefix + dir + '/phone/' + zonesize,
          request: {
            headers: {
              'content-type': 'charset=UTF-8',
              'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
              'content-type': 'charset=UTF-8'
            }
          },
        };
      } else {
        var a = {
          urls: [url],
          directory: path_prefix + dir + '/' + zonesize,
          request: {
            headers: {
              'content-type': 'charset=UTF-8',
            }
          },
        };
      }
      setTimeout(() => {
        console.log(dir + "  開始下載!");

        scrape(a).then((result) => {
          console.log(dir + "/" + zonesize + "下載完成!!");
        }).catch(console.log);
      }, 500);
    }

  }



}

module.exports = CronJobController

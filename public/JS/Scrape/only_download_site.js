var fs = require('fs');
var scrape = require('website-scraper');
var adm_zip = require('adm-zip');


function only_download_site(url,SiteName,phone){
    console.log('only download site trigger');
    console.log(url+','+SiteName+','+phone);
    
    if (phone == true) {
        var a = {
          urls: [url],
          directory: 'public/DownLoadSite/'+SiteName,
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
          directory: 'public/DownLoadSite/'+SiteName,
          request: {
            headers: {
              'content-type': 'charset=UTF-8',
            }
          },
        };
      }

    process.setMaxListeners(0);
    scrape(a).then((result) => {
        setTimeout(function(){
            // var zip =new adm_zip();
            // zip.addLocalFile('public/DownLoadSite/'+SiteName);
            // zip.writeZip('public/DownLoadSiteZIP/'+SiteName+'.zip');  
        },1000)
        console.log('下載')
      }).catch(console.log);
}

module.exports = {
    only_download_site:only_download_site
}
var sc = require('./sc');
var fs = require('fs');

async function StartDownLoadPage(){
    // await sc.set_option("https://www.thenewslens.com/", '關鍵評論往', '300250', true, "thenewslens_m_300250");
    // await sc.set_option("https://www.tagsis.com/cat/1", '女生集合', '300600', false , "tagsis_pc_300600");
    // await sc.set_option("http://play.nownews.com/", '旅食樂', '300250', true , "nownews_m_300250");
    // await sc.set_option("https://udn.com/news/story/7320/3463614", 'UDN', '300250', false , "nothing");

    //讀取config.json 取得參數後 在用迴圈執行set_option方法 下載網站
    fs.readFile('public/JS/Scrape/config.json','utf8',async function(err,config){
        if(err)throw err;
        var obj = JSON.parse(config);
        var len = obj.set.length;
        for(var x=0;x<len;x++){
            await sc.set_option(obj.set[x][0], obj.set[x][1], obj.set[x][2], obj.set[x][3] , obj.set[x][4]);
        }
    })
}

module.exports = {
    StartDownLoadPage:StartDownLoadPage
}
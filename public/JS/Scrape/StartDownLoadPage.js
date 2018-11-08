var sc = require('./sc');

async function StartDownLoadPage(){
    await sc.set_option("https://www.thenewslens.com/", '關鍵評論往', '300250', true, "thenewslens_m_300250");
    await sc.set_option("https://www.tagsis.com/cat/1", '女生集合', '300600', false , "tagsis_pc_300600");
    await sc.set_option("http://play.nownews.com/", '旅食樂', '300250', true , "nownews_m_300250");
}

module.exports = {
    StartDownLoadPage:StartDownLoadPage
}
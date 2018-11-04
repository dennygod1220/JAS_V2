var fs = require('fs');
var cheerio = require('cheerio');

var basic_zone = {
  modifyhtml: function (path, funcname) {
    fs.readFile(path + '/index.html', 'utf8', function (err, data) {
      //未帶入function 名稱 就不進行添加預設版位
      if(funcname == false){

      }else{

        var df = require('./'+funcname);
        //將讀出的html 丟到setDefaultZone方法去改成有預設版位的
        df.setDefaultZone(data,path);
        // console.log(df.getPlayers());

      }

    });

  }
}


module.exports = basic_zone;

//300250 預設版位 8707
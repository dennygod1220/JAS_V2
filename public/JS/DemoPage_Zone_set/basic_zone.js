var fs = require('fs');
var cheerio = require('cheerio');

var basic_zone = {
  modifyhtml: function (path, funcname) {

    fs.appendFile(path + '/JAS_FuncName.txt', funcname, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    fs.readFile(path + '/index.html', 'utf8', function (err, data) {
      //未帶入function 名稱 就不進行添加預設版位

      //2018 11 08 不透過 Cron 設定 自訂版位了 ， 直接從 business_demopage_socket.js 修改 defaulezone
      if(funcname == false){

      }else{
        var df = require('./'+funcname);
        //將讀出的html 丟到setDefaultZone方法去改成有預設版位的
        df.setDefaultZone(data,path);

      }

    });

  }
}


module.exports = basic_zone;

//300250 預設版位 8707
//300600 預設版位 8708
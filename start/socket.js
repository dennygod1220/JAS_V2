const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const fs = use('fs')
var rd = use('rd');
var find = use('find');
var dir = use('node-dir');


io.on('connection', function (socket) {
  console.log("ID: " + socket.id + " 連線");


  //Client 選擇裝置後 ， 告訴Server -> Server 告訴裝置 可用版位大小目錄
  socket.on('CtoS which device', function (device) {

    //取得 裝置 底下所有的目錄

    var path = './public/DemoPage/site/' + device.device + '/';
    try{
      display_subdir(path, 'StoC device dir');
    }catch(e){
      console.log(e);
    }
  })


  //Client 選擇版位大小目錄後 告訴server -> Server 告訴Client可用 網站
  socket.on('CtoS which ZoneSize', function (ZoneSize) {
    //取得 裝置/版位大小 底下所有的目錄

    var path = './public/DemoPage/site/' + ZoneSize.Device + '/' + ZoneSize.ZoneSize + '/';
    display_subdir(path, 'StoC site dir');
  })


  //Client 選擇自訂版位
  socket.on('CtoS which Site', function (Site) {

    var src = './public/DemoPage/site/' + Site.Device + '/' + Site.ZoneSize + '/' + Site.site + '/index.html';
    var dist = './public/DemoPage/site/' + Site.Device + '/' + Site.ZoneSize + '/' + Site.site + '/CusZone_' + socket.id + '.html';
    //複製檔案
    copyFile(src, dist);

    var getFunName = './public/DemoPage/site/' + Site.Device + '/' + Site.ZoneSize + '/' + Site.site + '/JAS_FuncName.txt';
    //讀取 此網站所使用的function Name 將他require進來
    fs.readFile(getFunName, 'utf8', function (err, funcName) {
      if (err) throw err;
      var df = require('../public/JS/DemoPage_Zone_set/' + funcName);
      fs.readFile(dist, 'utf8', function (err, html) {
        df.SetCusZone(html, dist, Site.zone_info);
      })

      //告訴 Client 自訂版位OK
      io.sockets.connected[socket.id].emit('StoC cus zone ok', {
        CusZoneUrl: '/DemoPage/site/' + Site.Device + '/' + Site.ZoneSize + '/' + Site.site + '/CusZone_' + socket.id + '.html',
      });
    })

    // display_subdir(path,'StoC site dir');
  })



  //=========================================================================
  //=======================ADMIN ADD=========================================
  //=========================================================================
  socket.on('CtoS add setoption',function(data){
    fs.readFile('public/JS/Scrape/config.json','utf8', function(err,config){
      if(err)throw err;
      var obj = JSON.parse(config);
      var arr = [];
      arr.push(data.url);
      arr.push(data.SiteName);
      arr.push(data.ZoneSize);
      if(data.PCorPhone == "PC"){
        arr.push(false);
      }else{
        arr.push(true);
      }
      arr.push(data.FuncName);
      obj.set.push(arr);
      var newobj = JSON.stringify(obj)

      fs.writeFile('public/JS/Scrape/config.json', newobj, function(err){
        if(err){
          console.log(err);
        }else{
          //告訴client 好了，戴上定義JS的內容
          io.sockets.connected[socket.id].emit('StoC Cus Js Temp');
        }
      })
    })
  })

  //============================================================
  //=================Client 給 Server 網站改版位的JS code========
  //============================================================
  socket.on('CtoS cus site js',function(code){
    console.log(code);
    var JS_CODE = "var cheerio = require('cheerio');var fs = require('fs');"+
        "function SetCusZone(html,path,zone) {"+
        "var $ = cheerio.load(html);"+
        code.cus_cunc+
        "fs.writeFile(path, $.html(), function () {"+
        "});"+
      "}"+
      "function setDefaultZone(html,path) {"+ 
      "  var img_dir = fs.readdirSync(path + '/images/');"+
      "img_dir.forEach(element => {"+
      "fs.renameSync(path + '/images/' + element, path+ '/images/' + decodeURIComponent(escape(element)));"+
      "});"+
      "var $ = cheerio.load(html);"+
      code.default_func+
      "fs.writeFile(path+'/DefaultZone.html', $.html(), function () {"+
      "});"+
      "}"+
      "module.exports = {"+
      "setDefaultZone: setDefaultZone,SetCusZone: SetCusZone};";

    fs.writeFile('public/JS/DemoPage_Zone_set/'+code.FuncName+'.js',JS_CODE,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("新增OK");
      }
    })
  })


  //======================================================
  //==================純下載網站===========================
  //======================================================

  socket.on('CtoS download site info',function(data){
    console.log(data);
    var dl = require('../public/JS/Scrape/only_download_site');
    if(data.PCorPhone == "PC"){
      dl.only_download_site(data.url,data.SiteName,false);
    }else{
      dl.only_download_site(data.url,data.SiteName,true);
    }
  })

  //===============================================
  socket.on('disconnect', (reason) => {
    console.log("Leave");
  });



  //======================================================
  //======================PREROLL=========================
  //======================================================

  socket.on('CtoS tell me PreRoll site',function(){
    var PreRoll_Dir = './public/DemoPage/preroll/';
    display_subdir(PreRoll_Dir, 'StoC can use PreRoll Site');
  })

    //======================================================
  //======================內文全屏=========================
  //======================================================

  socket.on('CtoS tell me Content_zone site',function(){
    var Content_zone = './public/DemoPage/site/phone/內文全屏/';
    display_subdir(Content_zone, 'StoC can use Content_zone Site');
  })

    //Client 選擇自訂版位
    socket.on('CtoS Content_zone Site', function (Site) {

      var src = './public/DemoPage/site/phone/內文全屏/' + Site.site + '/index.html';
      var dist = './public/DemoPage/site/phone/內文全屏/' + Site.site + '/CusZone_' + socket.id + '.html';
      //複製檔案
      copyFile(src, dist);
  
      var getFunName ='./public/DemoPage/site/phone/內文全屏/' + Site.site + '/JAS_FuncName.txt';
      //讀取 此網站所使用的function Name 將他require進來
      fs.readFile(getFunName, 'utf8', function (err, funcName) {
        if (err) throw err;
        var df = require('../public/JS/DemoPage_Zone_set/' + funcName);
        fs.readFile(dist, 'utf8', function (err, html) {
          df.SetCusZone(html, dist, Site.zone_code);
        })
  
        //告訴 Client 自訂版位OK
        io.sockets.connected[socket.id].emit('StoC cus content zone ok', {
          CusZoneUrl: '/DemoPage/site/phone/內文全屏/' + Site.site + '/CusZone_' + socket.id + '.html',
        });
      })
  
      // display_subdir(path,'StoC site dir');
    })
  //======================================================
  //======================================================
  //======================================================
  //=====================MY Function======================
  //======================================================
  //======================================================
  //======================================================

  //==========複製檔案
  function copyFile(src, dist) {
    console.log("COPY " + dist);

    fs.writeFileSync(dist, fs.readFileSync(src));
  }

  //=======顯示目錄
  function display_subdir(path, con_name) {
    try {
      fs.readdir(path, function (err, files) {
        //声明一个数组存储目录下的所有文件夹
        var floder = [];
        //从数组的第一个元素开始遍历数组
        (function iterator(i) {
          //遍历数组files结束
          if(files != undefined){
            try{
              if (i == files.length) {  
                io.sockets.connected[socket.id].emit(con_name, {
                  dir: floder,
                })
                return;
              }
            }catch(e){
              io.sockets.connected[socket.id].emit(con_name, {
                dir: ["錯誤! 沒有檔案"],
              })
            }
          }
          //遍历查看目录下所有东西
          try{
            fs.stat(path + files[i], function (err, stats) {
              //如果是文件夹，就放入存放文件夹的数组中
              if (stats.isDirectory()) {
                floder.push(files[i]);
              }
              iterator(i + 1);
            })
          }catch(e){
            io.sockets.connected[socket.id].emit(con_name, {
              dir: ["錯誤! 沒有檔案"],
            })
          }
        })(0)
      })
    } catch (e) {
      console.track(e);
    }
  }


})

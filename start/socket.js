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
      display_subdir(path,'StoC device dir');
    })


  //Client 選擇版位大小目錄後 告訴server -> Server 告訴Client可用 網站
  socket.on('CtoS which ZoneSize', function (ZoneSize) {
    //取得 裝置/版位大小 底下所有的目錄

    var path = './public/DemoPage/site/' + ZoneSize.Device+ '/' + ZoneSize.ZoneSize + '/';
    display_subdir(path,'StoC site dir');
  })


  socket.on('CtoS which Site', function (Site) {
    console.log(Site);


    // var path = './public/DemoPage/site/' + ZoneSize.Device+ '/' + ZoneSize.ZoneSize + '/';
    // display_subdir(path,'StoC site dir');
  })



  socket.on('CtoS which site', function (Cdata) {
    console.log("目錄= " + Cdata.dir + " ,版位大小= " + Cdata.zone_size + " ,手機電腦= " + Cdata.PCorPhone);
    var connect_id = socket.id;
    if (Cdata.PCorPhone == 'Phone') {
      var dir = './public/DemoPage/site/' + Cdata.dir + '/phone/' + Cdata.zone_size;
    } else {
      var dir = './public/DemoPage/site/' + Cdata.dir + '/PC' + Cdata.zone_size;
    }

    fs.exists(dir + '/index.html', function (exists) {
      if (exists == true) {
        //檔案存在 就複製一份
        copyFile(dir + '/index.html', dir + '/' + connect_id + '.html');
        if (Cdata.PCorPhone == 'Phone') {
          io.sockets.connected[socket.id].emit('StoC index html ok', {
            url: 'DemoPage/site/phone/' + Cdata.zone_size + '/' + Cdata.dir + '/' + connect_id + '.html'
          })
        } else {
          io.sockets.connected[socket.id].emit('StoC index html ok', {
            url: 'DemoPage/site/PC/' + Cdata.zone_size + '/' + Cdata.dir + '/' + connect_id + '.html'
          })
        }

      } else {
        console.log(dir + '/index.html is not exist');
        io.sockets.connected[socket.id].emit('StoC no index html');
      }

    });

    function copyFile(src, dist) {
      console.log("COPY Index.html");

      fs.writeFileSync(dist, fs.readFileSync(src));
    }

  })


  socket.on('disconnect', (reason) => {
    console.log("Leave");
  });

  //==================MY Function=================
  function display_subdir(path,con_name) {
    fs.readdir(path, function (err, files) {
      //声明一个数组存储目录下的所有文件夹
      var floder = [];
      //从数组的第一个元素开始遍历数组
      (function iterator(i) {
        //遍历数组files结束
        if (i == files.length) {
          console.log("SERVER 目錄==========");
          console.log(floder);
          console.log("====================");

          io.sockets.connected[socket.id].emit(con_name, {
            dir: floder,
          })
          return;
        }
        //遍历查看目录下所有东西
        fs.stat(path + files[i], function (err, stats) {
          //如果是文件夹，就放入存放文件夹的数组中
          if (stats.isDirectory()) {
            floder.push(files[i]);
          }
          iterator(i + 1);
        })

      })(0)
    })
  }


})

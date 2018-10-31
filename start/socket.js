const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const fs = use('fs')

io.on('connection', function (socket) {
  console.log("ID: " + socket.id + " 連線");

  socket.on('CtoS which site', function (Cdata) {
    console.log("目錄= " + Cdata.dir + " ,版位大小= " + Cdata.zone_size + " ,手機電腦= " + Cdata.PCorPhone);
    var connect_id = socket.id;
    if (Cdata.PCorPhone == 'Phone') {
      var dir = './public/DemoPage/site/' + Cdata.dir + '/phone/' + Cdata.zone_size;
    } else {
      var dir = './public/DemoPage/site/' + Cdata.dir + '/' + Cdata.zone_size;
    }

    fs.exists(dir + '/index.html', function (exists) {
      if (exists == true) {
        //檔案存在 就複製一份
        copyFile(dir + '/index.html', dir + '/' + connect_id + '.html');
        if (Cdata.PCorPhone == 'Phone') {
            io.sockets.connected[socket.id].emit('StoC index html ok', {
                url: 'DemoPage/site/' + Cdata.dir + '/phone/' + Cdata.zone_size + '/'+connect_id+'.html'
            })
        }else{
            io.sockets.connected[socket.id].emit('StoC index html ok', {
                url: 'DemoPage/site/' + Cdata.dir + '/' + Cdata.zone_size + '/'+connect_id+'.html'
            })
        }

      } else {
        console.log(dir + '/index.html is not exist');
        io.sockets.connected[socket.id].emit('StoC no index html');
      }

    });
    function copyFile(src, dist) {
        fs.writeFileSync(dist, fs.readFileSync(src));
    }

  })

})

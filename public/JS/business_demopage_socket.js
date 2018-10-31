  var socket = io();
  socket.emit('CtoS which site', {
    dir: 'thenewslens',
    zone_size: '300250',
    PCorPhone: 'Phone'
  });
  socket.on('StoC no index html', function () {
    console.log("檔案不存在");
  })
  socket.on('StoC index html ok', function (data) {
    console.log(data.url);

    //假網頁存在，client給Server素材ID
    //建立input 框


  })

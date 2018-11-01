  var socket = io();

  var zone_size_arr = [];

  var app = new Vue({
    el: "#demopage_choise",
    delimiters: ['$$', '$$'],
    data: {
      device: '',
      zone_size_arr: zone_size_arr,
      zonesize:'',
    },
    methods: {
      ch_device: function (device) {
        this.device = device;
        socket.emit('CtoS which device', {
          device: device
        })
      },
      ch_zone_size: function (size) {
        this.zonesize = size;
      }
    },
    computed: {
      // 接收Server告知的版位大小(陣列)選項後，
      // 將此陣列內容顯示於畫面中
      display_zone_size: function () {
        socket.on('StoC device dir', function (dir) {
          $("#zone_size_block").css('display', 'block');
          zone_size_arr.length = 0;
          dir.dir.forEach(ele => {
            zone_size_arr.push(ele);
          });
        })
      }
    }
  })



  socket.on('StoC no index html', function () {
    console.log("檔案不存在");
  })
  socket.on('StoC index html ok', function (data) {
    console.log(data.url);

    //假網頁存在，client給Server素材ID
    //建立input 框
  })





  socket.on('connect_timeout', (timeout) => {
    // ...
    console.log(timeout);
  });

  socket.on('error', (error) => {
    // ...
    console.log(error)
  });

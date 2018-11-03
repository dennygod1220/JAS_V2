  var socket = io();

  var zone_size_arr = [];
  var site_arr = [];


  var app = new Vue({
    el: "#demopage_choise",
    delimiters: ['$$', '$$'],
    data: {
      device: '',
      zone_size_arr: zone_size_arr,
      zonesize:'',
      site_arr:site_arr,
      site:'',
    },
    methods: {
      ch_device: function (device) {
        //當選擇裝置時，避免不同裝置底下網站不同，將網站洗掉讓使用者重新選擇
        site_arr.length = 0;
        this.site = '';
        zone_size_arr.length = 0;
        this.zonesize = '';
        //=================
        this.device = device;
        socket.emit('CtoS which device', {
          device: device
        });
      },
      ch_zone_size: function (size) {
        site_arr.length = 0;
        this.site = '';
        this.zonesize = size;
        socket.emit('CtoS which ZoneSize',{
          Device:this.device,
          ZoneSize:size
        })
      },
      ch_site: function (site) {
        console.log(site)
        this.site = site;
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
      },
      //選擇可用的網站
      display_can_use_site: function () {
        socket.on('StoC site dir', function (dir) {
          $("#site_block").css('display', 'block');
          site_arr.length = 0;
          dir.dir.forEach(ele => {
            site_arr.push(ele);
          });
        })
      },
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

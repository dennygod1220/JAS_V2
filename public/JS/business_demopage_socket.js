  var socket = io();

  var zone_size_arr = [];
  var site_arr = [];


  var app = new Vue({
    // el: "#demopage_choise",
    el:"#home",
    delimiters: ['$$', '$$'],
    data: {
      device: '',
      zone_size_arr: zone_size_arr,
      zonesize: '',
      site_arr: site_arr,
      site: '',
      df_zone: '',
      matiral_id: '',
      zone_info: ''
    },
    methods: {
      ch_device: function (device) {
        //當選擇裝置時，避免不同裝置底下網站不同，將網站洗掉讓使用者重新選擇
        site_arr.length = 0;
        this.site = '';
        zone_size_arr.length = 0;
        this.zonesize = '';
        this.df_zone = '';
        //=================
        this.device = device;
        socket.emit('CtoS which device', {
          device: device
        });
      },
      //點了 版位大小 後 觸發事件
      ch_zone_size: function (size) {
        site_arr.length = 0;
        this.site = '';
        this.zonesize = size;
        this.df_zone = '';

        socket.emit('CtoS which ZoneSize', {
          Device: this.device,
          ZoneSize: size
        })
      },
      //點了 網站 後 觸發事件
      ch_site: function (site) {
        this.site = site;
        this.df_zone = '';
      },
      //選擇 預設版位 或是 自訂版未
      ch_zone_df: function (zone_cus) {
        if (zone_cus == 'default') {
          //用版位大小 給定 預設cfadc 版位ID
          switch (this.zonesize) {
            case '300250':
              var url = '/DemoPage/site/' + this.device + '/' + this.zonesize + '/' + this.site + '/DefaultZone.html?cfadc=8707:' + this.matiral_id;
              var win = window.open(url, '_blank');
              win.focus();
              break;
            case '300600':
              var url = '/DemoPage/site/' + this.device + '/' + this.zonesize + '/' + this.site + '/DefaultZone.html?cfadc=8708:' + this.matiral_id;
              var win = window.open(url, '_blank');
              win.focus();
              break;
            case '320480':
              var url = '/DemoPage/site/' + this.device + '/' + this.zonesize + '/' + this.site + '/DefaultZone.html?cfadc=8725:' + this.matiral_id;
              var win = window.open(url, '_blank');
              win.focus();
              break;
            case '72890':
              var url = '/DemoPage/site/' + this.device + '/' + this.zonesize + '/' + this.site + '/DefaultZone.html?cfadc=8726:' + this.matiral_id;
              var win = window.open(url, '_blank');
              win.focus();
              break;
            case '970250':
              var url = '/DemoPage/site/' + this.device + '/' + this.zonesize + '/' + this.site + '/DefaultZone.html?cfadc=8727:' + this.matiral_id;
              var win = window.open(url, '_blank');
              win.focus();
              break;
          }
        } else {
          this.df_zone = zone_cus;
          socket.emit('CtoS which Site', {
            Device: this.device,
            ZoneSize: this.zonesize,
            site: this.site,
            df_zone: zone_cus,
            zone_info: this.zone_info
          });
        }
      },
      trimarea: function (e) {
        this.zone_info = e.target.value.trim();
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
            if(ele == "內文全屏"){

            }else{
              zone_size_arr.push(ele);
            }
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
      //是否顯示 可選網站
      display_site_block: function () {
        if (this.device == '' || this.zonesize == '') {
          $("#site_block").css('display', 'none');
        } else {
          $("#site_block").css('display', 'block');
        }
      },
      //是否顯示 自訂版位或預設版位
      display_df_zone_block: function () {
        if (this.device == '' || this.zonesize == '' || this.site == '') {
          $("#zone_ch_block").css('display', 'none');
        } else {
          $("#zone_ch_block").css('display', 'block');
        }
      },
    }
  })

  
  //==============PREROLL===============
  socket.emit('CtoS tell me PreRoll site');

  var pre_site_arr = [];

  var PREROLL = new Vue({
    el:"#profile",
    delimiters: ['$$', '$$'],
    data:{
      pre_site:pre_site_arr,
    },
    methods:{
      //取得使用者 選擇哪個preroll網站
      ch_pre_site:function(item){
        window.open('/DemoPage/preroll/'+item+'/index.html', '_blank');
      }
    },
    computed:{
      //詢問Server Preroll有啥網站
      getPreRollSite:function(){
        socket.on('StoC can use PreRoll Site',function(prerollsite){
          prerollsite.dir.forEach(ele=>{
            pre_site_arr.push(ele);
          });
        })
      }
    }
  })

  //==========內文全屏=========================
  socket.emit('CtoS tell me Content_zone site');
  var content_site_arr = [];

  var ContentCover = new Vue({
    el:"#content_zone",
    delimiters: ['$$', '$$'],
    data:{
      content_site_arr:content_site_arr,
      site:'',
      material_id:'',
      zone_code:''
    },
    methods:{
      //取得使用者 選擇哪個preroll網站
      ch_Content_site:function(item){
        this.site = item;
      },
      default_zone:function(){
        window.open('/DemoPage/site/phone/內文全屏/'+this.site+'/DefaultZone.html?cfadc=8730:'+this.material_id, '_blank');
      },
      Cus_zone:function(){
        socket.emit('CtoS Content_zone Site', {
          zone_code: this.zone_code,
          site: this.site,
        });
      }

    },
    computed:{
      //詢問Server 內文全屏有啥網站
      getContentZoneSite:function(){
        socket.on('StoC can use Content_zone Site',function(ContentZone){
          ContentZone.dir.forEach(ele=>{
              content_site_arr.push(ele);
          });
        })
      }
    }
  })



  //接收 Server 傳來的 自訂版位 建立完成事件
  socket.on('StoC cus zone ok', function (CusZoneUrl) {
    window.open(CusZoneUrl.CusZoneUrl, '_blank');
  })
  socket.on('StoC cus content zone ok', function (CusZoneUrl) {
    window.open(CusZoneUrl.CusZoneUrl, '_blank');
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

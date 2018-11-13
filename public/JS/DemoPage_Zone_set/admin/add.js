var socket = io();

var app = new Vue({
  el: "#content",
  delimiters: ['$$', '$$'],
  data: {
    url: '',
    SiteName: '',
    ZoneSize: '',
    PCorPhone: '',
    FuncName: '',
    default_func: '',
    cus_cunc: ''
  },
  methods: {
    send1: function () {
      socket.emit('CtoS add setoption', {
        url: this.url,
        SiteName: this.SiteName,
        ZoneSize: this.ZoneSize,
        PCorPhone: this.PCorPhone,
        FuncName: this.FuncName,
      });
    },
    send2: function () {
        var default_func = this.default_func.trim();
        var cus = this.cus_cunc.trim();
        socket.emit('CtoS cus site js',{
            default_func:default_func,
            cus_cunc:cus,
            FuncName: this.FuncName
        })
    }
  },
  computed: {
    getTemplate: function () {
      socket.on('StoC Cus Js Temp', function () {
        $("#collapseOne").collapse('hide');
        $("#collapseTwo").collapse('toggle');
      })
    }
  }

})

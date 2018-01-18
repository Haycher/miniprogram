const swiper = require("../../utils/ft.scale.swiper.js")
var mySwiper;
Page({
  data: {
    swiper: {
      number: 6,
      leftShow: 15,
      itemGap: 50,
      itemScaleGap: 15,
      index: 0
    },
    randerData: [1,2,3,4,5,6]
  },
  onLoad: function () {
    mySwiper = new swiper.ScaleSwiper('swiper', this, function(){//初始化幻灯片，将对应setting参数名、this、callback(可不传) 传入
      console.log(this.index);
    });
  }
})
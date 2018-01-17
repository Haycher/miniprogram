const swiper = require("../../utils/swiper.scale.js")
var mySwiper;
Page({
  data: {
    swiper: {
      number: 6,         //幻灯片数量
      leftShow: 15,      //左侧幻灯片露出15px
      itemGap: 50,       //放大前幻灯片间隙50px
      itemScaleGap: 15,  //放大后幻灯片间隙15px
      index: 0           //默认显示第一张幻灯片
    },
    randerData: [1,2,3,4,5,6]//用于渲染幻灯片的数据
  },
  onLoad: function () {
    mySwiper = new swiper.ScaleSwiper('swiper', this);//初始化幻灯片，将对应setting参数名和this传入
  },
  touchstart: function(evt){
  	mySwiper.touchstart(evt);
  },
  touchmove: function(evt){
  	mySwiper.touchmove(evt);
  },
  touchend: function(evt){
  	mySwiper.touchend(evt, function(){//幻灯片切换事件在这里回调
  		console.log(mySwiper.index);//当前幻灯片索引
  	});
  }
})
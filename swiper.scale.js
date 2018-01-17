/**
  小程序放大幻灯片循环组件
  幻灯片个数不得少于5个，对于少于5个的情况需要手动复制幻灯片让其数量达到5个以上
  同一页面可以存在多个幻灯片
  version 1.0.0
  By HaichunLyu 2018/01/17

  使用规范：
  
  const swiper = require("../../utils/swiper.scale.js")
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
      mySwiper = new swiper.ScaleSwiper('swiper', this);//初始化幻灯片，将对应setting参数名和this传入
    },
    touchstart: function(evt){
      mySwiper.touchstart(evt);
    },
    touchmove: function(evt){
      mySwiper.touchmove(evt);
    },
    touchend: function(evt){
      mySwiper.touchend(evt, function(){
        console.log(mySwiper.index);//当前幻灯片索引
      });
    }
  })

  wxml文件结构使用方案：
  <view class="swiper_wrapper">
    <view class="swiper_box" style="{{swiper.boxStyle}}" bindtouchstart="touchstart" bindtouchmove="touchmove" bindtouchend="touchend">
      <view class="swiper_item" style="{{swiper.styleArr[index]}}" wx:for="{{randerData}}">
        <view class="item">
          {{item}}
        </view>
      </view>
    </view>
  </view>

  wxss文件设定方案：
  .swiper_wrapper{padding: 50rpx 0;overflow: hidden;}
  .swiper_box{height: 90px;}
  .item{line-height: 90px;text-align: center;font-size: 30px;background-color: #eee;}
*/
module.exports = {
  ScaleSwiper: ScaleSwiper
}

var windowW = wx.getSystemInfoSync().windowWidth;

function ScaleSwiper(swiperName, _this){//新起一个幻灯片
  this.pageThis = _this;
  this.swiperName = swiperName;
  this.leftShow = 15;
  this.itemGap = 50;
  this.itemScaleGap = 15;
  this.index = 0;
  this.setting = _this.data[swiperName];
  this.number = this.setting.number;
  this.initSwiper();
}

ScaleSwiper.prototype.initSwiper = function() {
  if (this.setting.leftShow) this.leftShow = this.setting.leftShow;
  if (this.setting.itemGap) this.itemGap = this.setting.itemGap;
  if (this.setting.itemScaleGap) this.itemScaleGap = this.setting.itemScaleGap;
  if (this.setting.index) this.index = this.setting.index;
  this.boxWidth = windowW - (this.leftShow + this.itemGap) * 2;
  this.scaleNumber = (windowW - (this.leftShow + this.itemScaleGap) * 2) / this.boxWidth;
  this.boxStyle = 'position:relative;width:' + this.boxWidth + 'px;margin-left:auto;margin-right:auto;';
  this.setStyleArr(false, 0);
  this.setPageData();
}

ScaleSwiper.prototype.setPageData = function() {
  var data = {};
  data[this.swiperName + '.boxStyle'] = this.boxStyle;
  data[this.swiperName + '.styleArr'] = this.styleArr;
  this.pageThis.setData(data);
}

ScaleSwiper.prototype.touchstart = function(evt) {
  this.startTime = new Date().getTime();
  this.startX = evt.changedTouches[0].pageX;
  this.startY = evt.changedTouches[0].pageY;
  this.firstTouch = true;
}

ScaleSwiper.prototype.touchmove = function(evt) {
  var moveX = evt.changedTouches[0].pageX - this.startX;
  var moveY = evt.changedTouches[0].pageY - this.startY;
  if (this.firstTouch) {
    this.isSwiper = Math.abs(moveY) >= Math.abs(moveX) ? false : true;
    this.firstTouch = false;
  }
  if (this.isSwiper) {//如果是左右滑动事件
    this.setStyleArr(false, moveX);
    this.setPageData();
  }
}

ScaleSwiper.prototype.touchend = function(evt, callback) {
  if (!this.isSwiper) return false;
  var moveX = evt.changedTouches[0].pageX - this.startX;
  var timeGap = new Date().getTime() - this.startTime;
  if (Math.abs(moveX) > this.boxWidth/3 || Math.abs(moveX)/timeGap > .2) {
    if (moveX > 0) {
      this.index--;
    }else{
      this.index++;
    }
  }
  if (this.index === -1) {
    this.index = this.number - 1;
  }
  if (this.index === this.number) {
    this.index = 0;
  }
  this.setStyleArr(true, 0);
  this.setPageData();
  if (callback) callback();//滑动事件结束回调
}

ScaleSwiper.prototype.setStyleArr = function(showTransition, moveX) {
  var scaleNumber = this.scaleNumber;
  var scaleOffset = Math.abs(moveX) / (this.boxWidth + this.itemGap) * (scaleNumber - 1);
  var scaleCenter = scaleNumber - scaleOffset;
  var scaleLeft = 1;
  var scaleRight = 1;
  this.styleArr = [];
  if (moveX < 0) {//往左滑动，右侧放大
    scaleRight = 1 + scaleOffset;
  }
  if (moveX > 0) {//往右滑动，左侧放大
    scaleLeft = 1 + scaleOffset;
  }
  for (var i = 0; i < this.number; i++) {//创建样式数组
    var style = 'position:absolute;width:100%;height:100%;left:0;top:0;';
    var transitionStyle = 'transition:transform .4s ease-out;'
    if (i === this.index) {//中间item
      style += 'transform:translate3d(' + moveX + 'px,0,0) scale3d(' + scaleCenter + ', ' + scaleCenter + ', 1);';
      if (showTransition) style += transitionStyle;
    }else if(i + 1 === this.index ||  this.number - i + this.index === 1){//左侧第一个item
      style += 'transform:translate3d(' + (moveX - (this.boxWidth + this.itemGap)) + 'px,0,0) scale3d(' + scaleLeft + ', ' + scaleLeft + ', 1);';
      if (showTransition) style += transitionStyle;
    }else if(i + 2 === this.index ||  this.number - i + this.index === 2){//左侧第二个item
      style += 'transform:translate3d(' + (moveX - 2 * (this.boxWidth + this.itemGap)) + 'px,0,0);';
    }else{//剩余item全放在右侧
      var rightIndex = i - this.index > 0 ? i - this.index : i - this.index + this.number;//右边第rightIndex的元素
      if (rightIndex === 1) {//右侧第一个item
        style += 'transform:translate3d(' + (moveX + (this.boxWidth + this.itemGap)) + 'px,0,0) scale3d(' + scaleRight + ', ' + scaleRight + ', 1);';
        if (showTransition) style += transitionStyle;
      }else{//右侧第rightIndex个item
        style += 'transform:translate3d(' + (moveX + rightIndex * (this.boxWidth + this.itemGap)) + 'px,0,0);';
      }
    }
    this.styleArr.push(style);
  }
}
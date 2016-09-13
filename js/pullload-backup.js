define("pullload", ["zepto"], function(zepto) {

  var pullload = function(options) {
    this.defaultConfig = {
      container: zepto(document.body),
      el: zepto(document.body),          
      offsetScrollTop: 2,
      offsetY: 75,
      distanceBottom: 30,
      isbody:true,
      onPullDownMove:function(){},
      onPullDownRefresh:function(){},
      clearPullDownMove:function(){},
      onPullStart:function(){},
      onPullUpMove:function(){},
      onPullUpLoad:function(){}
    };
    this.config = zepto.extend(this.defaultConfig, options || {});
    this.init.call(this);
  };

  zepto.extend(pullload.prototype, {
    init: function() {
      this._cacheDom();
      this._initEvent();
      this.config.isbody = this.config.container[0] === document.body;
      console.info(this.config.isbody);
    },
    _cacheDom: function() {
      this.el = "string" == typeof this.config.el ? zepto(this.config.el) : this.config.el
    },
    _initEvent: function() {
      var self = this,                 //当前对象，闭包处理
        config = this.config,          //当前对象的配置参数
        element = this.el,             //根元素，zepto对象
        startX = 0,                    //用于保存touchstart时初始位置
        startY = 0;                    //用于保存touchstart时初始位置

      //绑定touchstart
      element.on("touchstart", function(event) {
        var targetEvent = event.changedTouches[0];
        startX = targetEvent.clientX;
        startY = targetEvent.clientY;
        config.onPullStart();
      });
      //绑定touchmove
      element.on("touchmove", function(event) {
        var scrollTop = config.container.scrollTop(),
          scrollH = config.container.prop("scrollHeight"),
          con_H = config.isbody ? document.documentElement.clientHeight : config.container.height(),
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - startX,
          diffY = curY - startY;
          console.info(diffY);
console.info(scrollH, scrollTop,con_H);
        //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
        if(Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)){
          //滚动距离小于设定值 &&回调onPullDownMove 函数，并且回传位置值
          if(diffY > 5 && scrollTop < config.offsetScrollTop ){
            //阻止执行浏览器默认动作
            event.preventDefault();
            config.onPullDownMove([{
              touchStartY: startY,
              touchMoveY: curY
            }]);
          } //滚动距离距离底部小于设定值
          else if(diffY < 0 && (scrollH - scrollTop - con_H) < config.distanceBottom ){
            //阻止执行浏览器默认动作
            event.preventDefault();
            config.onPullUpMove([{
              touchStartY: startY,
              touchMoveY: curY
            }]);
          }
        }
      });
      //绑定touchend
      element.on("touchend", function(event) {
        var scrollTop = config.container.scrollTop(),
          scrollH = config.container.prop("scrollHeight"),
          con_H = config.isbody ? document.documentElement.clientHeight : config.container.height(),
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - startX,
          diffY = curY - startY;

        //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
        if(Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)){
          if(diffY > 5 && scrollTop < config.offsetScrollTop ){
            //回调onPullDownRefresh 函数，即满足刷新条件
            config.onPullDownRefresh();
          }
          else if(diffY < 0 && (scrollH - scrollTop - con_H) < config.distanceBottom ){
            //回调onPullUpLoad 函数，即满足刷新条件
            config.onPullUpLoad();
          }
          else{
            //回调clearPullDownMove 函数，取消刷新动作
            config.clearPullDownMove();
          }
        }
        // //判断垂直移动距离是否大于设定值 && 容器滚动距离小于设定值 && 横向移动距离小于纵向移动距离
        // if( diffY > config.offsetY && s < config.offsetScrollTop && Math.abs(diffX) < Math.abs(diffY)){
        //   //回调onPullDownRefresh 函数，即满足刷新条件
        //   config.onPullDownRefresh();
        // } else {
        //   //回调clearPullDownMove 函数，取消刷新动作
        //   config.clearPullDownMove();
        // }
      });
    }
  });
  return pullload;
});
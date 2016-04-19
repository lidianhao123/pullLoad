define("pullload", ["zepto"], function(zepto) {

  var pullload = function(options) {
    this.defaultConfig = {
      container: zepto(document.body),
      el: zepto(document.body),          
      offsetScrollTop: 2,
      offsetY: 75,
      canPullDownMove:function(){},
      canPullDownRefresh:function(){},
      clearPullDownMove:function(){}
    };
    this.config = zepto.extend(this.defaultConfig, options || {});
    this.init.call(this);
  };

  zepto.extend(pullload.prototype, {
    init: function() {
      this._cacheDom();
      this._initEvent();
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
      });
      //绑定touchmove
      element.on("touchmove", function(event) {
        // var s = document.body.scrollTop,
        var s = config.container.scrollTop(),
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - startX,
          diffY = curY - startY;
          console.info(s);

        //判断垂直移动距离是否大于5 && body滚动距离小于设定值 && 横向移动距离小于纵向移动距离
        if(diffY > 5 && s < config.offsetScrollTop && Math.abs(diffX) < Math.abs(diffY) ){
          //阻止执行浏览器默认动作
          event.preventDefault();
          //回调canPullDownMove 函数，并且回传位置值
          config.canPullDownMove([{
            touchStartY: startY,
            touchMoveY: curY
          }]);
        }
      });
      //绑定touchend
      element.on("touchend", function(event) {
        // var s = document.body.scrollTop,
        var s = config.container.scrollTop(),
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - startX,
          diffY = curY - startY;

        //判断垂直移动距离是否大于设定值 && 容器滚动距离小于设定值 && 横向移动距离小于纵向移动距离
        if( diffY > config.offsetY && s < config.offsetScrollTop && Math.abs(diffX) < Math.abs(diffY)){
          //回调calPullDownRefresh 函数，即满足刷新条件
          config.canPullDownRefresh();
        } else {
          //回调clearPullDownMove 函数，取消刷新动作
          config.clearPullDownMove();
        }
      });
    }
  });
  return pullload;
});
(function(){

  var coreDefaultConfig = {
    offsetScrollTop: 2,
    offsetY: 75,
    distanceBottom: 100,
    onPullDownMove:function(){},
    onPullDownRefresh:function(){},
    clearPullDownMove:function(){},
    onPullUpMove:function(){},
    onPullUpLoad:function(){}
  }

  var pullloadCore = function(opts) {
    this.init(opts);
  };

  pullloadCore.prototype = {
    //用于保存touchstart时初始位置
    startX: 0,
    //用于保存touchstart时初始位置
    startY: 0,
    //配置信息
    config: null,

    init: function(opts){
      this.config = extend(coreDefaultConfig, opts || {});
    },
    onStart: function(x, y){
      this.startX = x;
      this.startY = y;
    },
    onMove: function(x, y, scrollTop, scrollH, conH){
      var diffX = x - this.startX,
        diffY = y - this.startY;

      //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
      if(Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)){
        //滚动距离小于设定值 &&回调onPullDownMove 函数，并且回传位置值
        if(diffY > 5 && scrollTop < this.config.offsetScrollTop ){
          // //阻止执行浏览器默认动作
          // event.preventDefault();
          this.config.onPullDownMove(this.startY, y);
        } //滚动距离距离底部小于设定值
        else if(diffY < 0 && (scrollH - scrollTop - conH) < this.config.distanceBottom ){
          //阻止执行浏览器默认动作
          // event.preventDefault();
          this.config.onPullUpMove(this.startY, y);
        }
      }
    },
    onEnd: function(x, y, scrollTop, scrollH, conH){
       var diffX = x - this.startX,
        diffY = y - this.startY;

      //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
      if(Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)){
        if(diffY > 5 && scrollTop < this.config.offsetScrollTop ){
          //回调onPullDownRefresh 函数，即满足刷新条件
          this.config.onPullDownRefresh();
        }
        else if(diffY < 0 && (scrollH - scrollTop - conH) < this.config.distanceBottom ){
          //回调onPullUpLoad 函数，即满足刷新条件
          this.config.onPullUpLoad();
        }
        else{
          //回调clearPullDownMove 函数，取消刷新动作
          this.config.clearPullDownMove();
        }
      }
    }
  }

  var defaultConfig = {
    container: null,   //具有scroll的容器
    wrapper: null,     //结构外包围元素
    // offsetScrollTop: 2,
    // offsetY: 75,
    // distanceBottom: 30,
    onRefresh: function(){},
    onLoadMore: function(){}
  }
  extendFns = ["onPullDownMove", "onPullDownRefresh", "clearPullDownMove", "onPullUpMove", "onPullUpLoad"];
  extendProps = ["offsetScrollTop", "offsetY", "distanceBottom"];

  var STATS = {
    init: '',
    pulling: 'pulling',
    enough: 'pulling enough',
    refreshing: 'refreshing',
    refreshed: 'refreshed',
    reset: 'reset',

    loading: 'loading' // loading more
  };

  var pullload = function(opts){
    this.init(opts);
  }

  pullload.prototype = {
    config: {},
    container: null,   //具有scroll的容器
    wrapper: null,     //结构外包围元素
    loaderBody: null,  //DOM 对象
    loaderSymbol: null, //DOM 对象
    loaderBtn: null,    //DOM 对象
    _core: null,       //pullloadCore 实例
    loaderState: STATS.init,
    hasMore: true,    //是否有加载更多
    init: function(opts){
      this.config.onRefresh = opts.onRefresh || function(){};
      this.config.onLoadMore = opts.onLoadMore || function(){};
      this.container = opts.container;
      this.wrapper = opts.wrapper;
      this.loaderBody = this.wrapper.querySelector(".tloader-body");
      this.loaderSymbol = this.wrapper.querySelector(".tloader-symbol");
      this.loaderBtn = this.wrapper.querySelector(".tloader-btn");
      bindAll(extendFns.concat(['onTouchStart','onTouchMove','onTouchEnd']), this);
      var coreOpts = extendArrProps(extendFns, {}, this);

      coreOpts = extendArrProps(extendProps, coreOpts, opts);
      this._core = new pullloadCore(coreOpts);
      addEvent(this.wrapper, "touchstart", this.onTouchStart);
      addEvent(this.wrapper, "touchmove", this.onTouchMove);
      addEvent(this.wrapper, "touchend", this.onTouchEnd);
    },
    destory: function(){
      removeEvent(this.wrapper, "touchstart", this.onTouchStart);
      removeEvent(this.wrapper, "touchmove", this.onTouchMove);
      removeEvent(this.wrapper, "touchend", this.onTouchEnd);
    },
    onTouchStart: function(event){
      var targetEvent = event.changedTouches[0],
        startX = targetEvent.clientX,
        startY = targetEvent.clientY;

      this._core.onStart(startX, startY);
    },
    onTouchMove: function(event){
      var targetEvent = event.changedTouches[0],
        startX = targetEvent.clientX,
        startY = targetEvent.clientY,
        scrollTop = this.container.scrollTop,
        scrollH = this.container.scrollHeight,
        conH = this.container === document.body ? document.documentElement.clientHeight : this.container.offsetHeight;

      this._core.onMove(startX, startY, scrollTop, scrollH, conH);
    },
    onTouchEnd: function(event){
      var targetEvent = event.changedTouches[0],
        startX = targetEvent.clientX,
        startY = targetEvent.clientY,
        scrollTop = this.container.scrollTop,
        scrollH = this.container.scrollHeight,
        conH = this.container === document.body ? document.documentElement.clientHeight : this.container.offsetHeight;

      // console.info("onTouchEnd");
      this._core.onEnd(startX, startY, scrollTop, scrollH, conH);
    },
    // 拖拽的缓动公式 - easeOutSine
    easing: function(distance) {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      var t = distance;
      var b = 0;
      var d = screen.availHeight; // 允许拖拽的最大距离
      var c = d / 2.5; // 提示标签最大有效拖拽距离

      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    setChange: function(pullHeight, state){
      var lbodyTop = pullHeight !== 0 ? 'translate3d(0, ' + pullHeight + 'px, 0)' : "",
        symbolTop = pullHeight - 50 > 0 ? pullHeight - 50 : 0;
        lSymbol = symbolTop !== 0 ? 'translate3d(0, ' + symbolTop + 'px, 0)' : "";
      // console.info(lbodyTop)
      this.setClassName(state);
      this.loaderBody.style.WebkitTransform = lbodyTop;
      this.loaderBody.style.transform = lbodyTop;
      this.loaderSymbol.style.WebkitTransform = lSymbol;
      this.loaderSymbol.style.transform = lSymbol;
    },
    setClassName: function(state){
      this.loaderState = state;
      this.wrapper.className = 'tloader state-' + state;
    },
    setEndState: function(){
      this.setChange(0, STATS.reset);
    },
    setNoMoreState:function(){
      this.loaderBtn.style.display = "block";
      this.hasMore = false;
    },
    resetLoadMore: function(){
      this.loaderBtn.style.display = "none";
      this.hasMore = true;
    },
    onPullDownMove: function(startY, y){
      if(this.loaderState === STATS.refreshing){
        return false;
      }
      event.preventDefault();

      var diff = y - startY, loaderState;
      if (diff < 0) {
        diff = 0;
      }

      diff = this.easing(diff);
      if (diff > 100) {
        loaderState = STATS.enough;
      } else {
        loaderState = STATS.pulling;
      }
      this.setChange(diff, loaderState);
    },
    onPullDownRefresh: function(){
      if(this.loaderState === STATS.refreshing){
        return false;
      }
      else if (this.loaderState === STATS.pulling) {
        this.setEndState();
      } else {
        this.setChange(0, STATS.refreshing);
        this.resetLoadMore();
        if (typeof this.config.onRefresh === "function") {
          this.config.onRefresh(
            bind(function(){
              this.setChange(0, STATS.refreshed);
              setTimeout(bind(function(){this.setChange(0, STATS.init);}, this), 1000);
            }, this),
            bind(function(){
              this.setEndState();
            }, this)
          )
        }
      }
    },
    clearPullDownMove: function(){},
    onPullUpMove: function(staartY, y){
      if(!this.hasMore || this.loaderState === STATS.loading){
        return false;
      }
      if (typeof this.config.onLoadMore === "function") {
        this.setChange(0, STATS.loading);
        // console.info(this.state);
        this.config.onLoadMore(bind(function(isNoMore){
          this.setEndState();
          if(isNoMore){
            this.setNoMoreState();
          }
        }, this));
      }
    },
    onPullUpLoad: function(){}
  }

  function extendArrProps(arr, obj1, obj2){
    var index = 0, len = arr.length;
    for(index; index < len; index++){
      var value = arr[index];
      if(typeof obj2[value] !== "undefined"){
        obj1[value] = obj2[value];
      }
    }
    return obj1;
  }

  //copy obj2 props to obj1 no deepClone
  function extend(obj1, obj2){
    var newObj = {};
    for(var s in obj1){
      newObj[s] = obj1[s]
    }
    for(var s in obj2){
      newObj[s] = obj2[s]
    }
    return newObj;
  }

  function addEvent(obj, type, fn) {
    if (obj.attachEvent) {
      obj['e' + type + fn] = fn;
      obj[type + fn] = function () { obj['e' + type + fn](window.event); }
      obj.attachEvent('on' + type, obj[type + fn]);
    } else
      obj.addEventListener(type, fn, false);
  }
  function removeEvent(obj, type, fn) {
    if (obj.detachEvent) {
      obj.detachEvent('on' + type, obj[type + fn]);
      obj[type + fn] = null;
    } else
      obj.removeEventListener(type, fn, false);
  }

  function asArray(quasiArray, start) {
    var result = [],
      i = (start || 0);
    for (; i < quasiArray.length; i++) {
      result.push(quasiArray[i]);
    }
    return result;
  }

  function bind(func, context) {
    if (arguments.length < 2 && typeof arguments[0] === "undefined") {
        return func;
    }

    var __method = func;
    var args = asArray(arguments, 2);

    return function() {
		var array = args.concat(asArray(arguments, 0));
        return __method.apply(context, array);
    };
  }
  /* bindAll 批量绑定
   * @param fns 待绑定的函数名称
   * @param obj 待绑定的实例对象
   * @param context 用于绑定的上下文对象
   * @describe 如果 context 为 undefined 则context = obj
  */
  function bindAll(fns, obj, context){
    var index = 0, len = fns.length;
    if(context === undefined){
      context = obj;
    }

    for(index; index < len; index++){
      var key = fns[index];
      if(typeof obj[key] === 'function'){
        obj[key] = b(obj[key], context);
      }
    }
    function b(func, context){
      return function(){
        return func.apply(context, asArray(arguments, 0));
      }
    }
  }

  window.pullload = pullload;
  //增加 require 支持
  if ( typeof define === "function" && define.amd ) {
    define( "pullload", [], function () { return pullload; });
  }

})();
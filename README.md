# pullLoad
移动端 html5 插件，实现下拉刷新，加载更多等功能，支持require.js

#### 示例
http://lidianhao123.github.io/pullLoad/

# 基本思路
1. 不依赖第三方库
2. 固定DOM结构
3. 支持 body 或者固定高度的 DOM 块级元素作为外部容器 contianer（即可视区域大小）
4. 普通版本和 react 版本核心代码一致，即抽离出核心代码层和具体实现层 

    TODO 需要修改，经过实际开发发现抽离核心代码使逻辑更加的复杂，直接复用核心逻辑完成具体实现。
    
5. 触摸事件绑定在内容块 content（即高度为 auto 的DOM ）

# 功能点
1. 下拉刷新
2. 滚动到距底部距离小于阈值加载更多
3. 上拉加载更多 TODO
4. 通过复写 css 实现自定义样式 TODO
5. 返回顶部功能 TODO
6. 所有功能点已扩展的形式进行开发互不影响 TODO

# 使用说明
#### 添加固定 DOM 结构模板

```html
<!-- 最外层包裹 DIV 的 class 会被重置 建议使用 id 进行配置 -->
<div id="test_div" class="">
  <div class="tloader-symbol">
    <p class="tloader-msg"><i></i></p>
    <p class="tloader-loading">
      <i class="ui-loading"></i>
    </p>
  </div>
  <div class="tloader-body">
    <!-- 此处添加具体内容 -->
  </div>
  <div class="tloader-footer">
    <p class="tloader-btn"></p>
    <p class="tloader-loading">
      <i class="ui-loading"></i>
    </p>
  </div>
</div>
```

#### 添加 Javascript 文件

```html
<script src="js/pullload.js"></script>
```
当然也支持 require 模块化方式
```js
require(["zepto", "pullload"], function($, pullload) {})
```

#### 创建 pullload 对象

此示例代码为 [domo1](http://lidianhao123.github.io/pullLoad/index.html) 中部分代码节选，详情可直接参考 [domo1](http://lidianhao123.github.io/pullLoad/index.html) 
```js
var installObj = new pullload({
  container: document.body,
  wrapper: document.getElementById("test_div"),
  downEnough: 100,
  distanceBottom: 300,
  // onRefresh 有两个回调函数，二者必须调用一个
  onRefresh: function(success,error){
    console.info("实际代码 onRefresh")
    setTimeout(function(){
      $(".test-ul").html(createAll(data));
      success();  //完成刷新调用
    },2000);
    //error();    //异常调用
  },
  // onLoadMore 有两个回调函数，二者必须调用一个
  onLoadMore: function(success, error){
    console.info("实际代码 onLoadMore")
    setTimeout(function(){
      $(".test-ul").append(createLi(data[loadMoreIndex]));
      // if(--loadMoreIndex){
        success(false);    //加载动作完成
      // } else{
      //   success(true);  //加载动作完成 并且传递 true 参数通知组件无更多内容
      // }
    },500);
    //error();             //单词请求异常调用
  },
});
```

# 参数说明：
- container  可以是 body 或者固定高度的 DOM 块级元素作为外部容器
- wrapper    必须是上述 id="test_div" 元素
- downEnough 下拉满足刷新的距离 默认值为100像素
- distanceBottom 距离底部距离触发加载更多 默认值为100像素 
- onRefresh  满足刷新动作回调函数，刷新的具体业务代码在此函数中进行，并且需要 success 或者 error
- onLoadMore 满足加载更多回调函数，加载更多聚义业务代码在此函数中进行，并且需要 success 或者 error。无更多内容时请执行success(true);
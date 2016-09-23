# pullLoad
Moblie html5 plugin for pull down refresh and pull up load more. Depend Zepto.js and require.js.

http://lidianhao123.github.io/pullLoad/

# 基本思路
1. 不依赖第三方库
2. 固定DOM结构
3. 支持 body 或者固定高度的 DOM 块级元素作为外部容器 contianer（即可视区域大小）
4. 普通版本和 react 版本核心代码一致，即抽离出核心代码层和具体实现层
5. 触摸事件绑定在内容块 content（即高度为 auto 的DOM ）

# 功能点
1. 下拉刷新
2. 滚动到距底部距离小于阈值加载更多
3. 上拉加载更多
4. 通过复写 css 实现自定义样式
5. 返回顶部功能
6. 所有功能点已扩展的形式进行开发互不影响

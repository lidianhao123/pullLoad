// fis.match('::package', {
//   postpackager: fis.plugin('loader', {
//     allInOne:true
//   })
// });.
// http://fis.baidu.com/fis3/docs/api/config-props.html
fis.set('project.ignore', ['fis-conf.js','config.json', '.gitignore', 'node_modules/**', 'output/**',]);
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

//发布到自己服务器wmb下面
var selfWmbPath = "/wmb";
fis.media("self").match('(*.{png,gif,jpg})', {
  url:selfWmbPath + "$0"
});
fis.media("self").match("(*.less)", {
  parser: fis.plugin('less'),
  url:selfWmbPath + "$0",
  optimizer: fis.plugin('clean-css'),
  rExt: '.css'
});
fis.media("self").match("(*.css)", {
  url:selfWmbPath + "$0",
  optimizer: fis.plugin('clean-css')
});
fis.media("self").match("(*.js)", {
  url:selfWmbPath + "$0"
});
fis.media("self").match("(*.mp3)", {
  url:selfWmbPath + "$0"
});

//发布到php环境下资源路径
var prodPath = "/Public";
fis.media("prod").match('(*.{png,gif,jpg})', {
  url:prodPath+"$0"
});

fis.media("prod").match("(*.less)", {
  parser: fis.plugin('less'),
  url:prodPath+"$0",
  optimizer: fis.plugin('clean-css'),
  rExt: '.css'
});
fis.media("prod").match("(*.css)", {
  url:prodPath+"$0",
  optimizer: fis.plugin('clean-css')
});
fis.media("prod").match("(*.js)", {
  url:prodPath+"$0"
});
fis.media("prod").match("(*.mp3)", {
  url:selfWmbPath + "$0"
});

fis.media("debug").match("(*.less)", {
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  // useSprite: true, ?__sprite
  rExt: '.css'
});

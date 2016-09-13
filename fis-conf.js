/*
 * @auth lidian
 * @date 2016-05-16
 * @desc 
 * 全局安装 fis3: sudo npm install -g fis3
 * 安装less插件 : sudo npm install -g fis-parser-less
 * 开发命令     : fis3 server start //开启fis3 本地server
 *                fis3 server open  //打开fis3 本地server文件夹路径
 *                fis3 server clean //清空本地server文件夹路径内容
 *                fis3 release debug -wL //将当前路径代码发布到本地调试服务器并且监听文件修改自动刷新浏览器
 *                fis3 release prod //发布代码到当前路径\output下
 * 
 * FIS3 构建会对 CSS 中，路径带 ?__sprite 的图片进行合并
 * http://fis.baidu.com/fis3/docs/beginning/release.html#CssSprite%E5%9B%BE%E7%89%87%E5%90%88%E5%B9%B6
 */
//FIS3 官方文档 http://fis.baidu.com/fis3/docs/beginning/intro.html
//全局属性文档 http://fis.baidu.com/fis3/docs/api/config-props.html
fis.set('project.ignore', ['printImgNames.js','fis-conf.js','node_modules/**', 'output/**',]);

fis.hook('relative');

//发布到默认的当前路径output下
fis.media("prod")
  .match('::package', {
    spriter: fis.plugin('csssprites')
  })
  .match("(*.less)", {
    parser: fis.plugin('less-2.x'),
    rExt: '.css',
    // 开发阶段默认不开启csssprites，如有需要设置成true即可
    useSprite: false,
    optimizer: fis.plugin('clean-css'),
    postprocessor: fis.plugin('autoprefixer',{
      "browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
      "cascade": true
    })
  })
  .match('**', {
    relative: true
  })
  //将代码直接部署至./output下
  .match('*', {
    deploy: fis.plugin('local-deliver', {
      to: './output'
    })
  });

//开发阶段使用
fis.media("debug")
  .match('::package', {
    spriter: fis.plugin('csssprites')
  })
  .match("(*.less)", {
    parser: fis.plugin('less-2.x'),
    rExt: '.css',
    // 开发阶段默认不开启csssprites，如有需要设置成true即可
    useSprite: false,
    postprocessor: fis.plugin('autoprefixer',{
      "browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
      "cascade": true
    })
  });

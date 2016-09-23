var config = {
    baseUrl: "js/",           //依赖相对路径
    paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
        zepto: 'zepto.min',
        jquery: 'jquery-2.2.2.min'
    },
    shim: {                     //引入没有使用requirejs模块写法的类库。backbone依赖underscore
        'zepto': {
            exports: '$'
        },
        'jquery': {
            exports: '$'
        }
    }
};

require.config(config);

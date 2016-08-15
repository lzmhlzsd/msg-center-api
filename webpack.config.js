/**
 * Created by lkj on 2016/6/28.
 */
'use strict';
var path = require('path'),
    webpack = require('webpack');

module.exports = {
    //页面入口文件配置
    entry:[
        'webpack-dev-server/client?http://localhost:5000',
        'webpack/hot/only-dev-server',
        //'./public/js/login.js'
        './public/src/entry.js'
    ],
    //入口文件输出配置
    output:{
        path:path.join(__dirname,'public/dist/js'),
        //publicPath: '/public/dist/js/',
        publicPath: 'http://localhost:5000/public/dist/js/',
        filename: "bundle.js"
    },
    externals:{
        antd: 'antd'
    },
    module: {
        //加载器配置
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['react-hot', 'babel'],
                //include: [path.join(__dirname, 'public/js')]
                include: [path.join(__dirname, 'public')]
            },
            //{ test: /\.js$/, loader: "jsx!babel", include: /public\/js/},
            { test: /\.js$/, loader: "jsx!babel", include: /public/},
            { test: /\.css$/, loader: "style!css"}
        ]
    },
    plugins: [
        //生产环境可以去掉
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
}
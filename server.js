/**
 * Created by lkj on 2016/7/9.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    stats: { colors: true },
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    inline: true
}).listen(5000, 'localhost', function (err, result) {
        if (err) console.log(err);
        console.log('Listening at localhost:5000');
    });
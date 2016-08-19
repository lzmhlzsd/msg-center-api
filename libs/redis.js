/**
 * Created by lukaijie on 16/5/30.
 */
var Redis = require('ioredis'),
    config = require('./config');
var redis = new Redis(config.redis);
var pub = new Redis(config.redis);
var email = require('./email');
var weixin = require('./email');
var msg = require('./email');

var u = require('underscore');

var api_v1 = require('../controller/api_v1');

redis.on('message', function (channel, message) {
    var objmsg = JSON.parse(message);
    if (u.where(objmsg.type, 'email').length > 0) {
        email.send_notice(objmsg);
    }
    if (u.where(objmsg.type, 'weixin').length > 0) {
        weixin.send_notice(objmsg);
    }
    if (u.where(objmsg.type, 'msg').length > 0) {
        msg.send_notice(objmsg);
    }
    console.log('Receive message %s from channel %s', message, channel);
});

redis.subscribe('email', 'music', function (err, count) {
    pub.publish('news', 'Hello World!');
});
redis.subscribe('weixin', 'music', function (err, count) {
    pub.publish('news', 'Hello World!');
});
redis.subscribe('msg', 'music', function (err, count) {
    pub.publish('news', 'Hello World!');
});
exports.pub_email = function (mes) {
    console.log(mes)
    pub.publish('email', JSON.stringify(mes));
}
exports.pub_weixin = function (mes) {
    console.log(mes)
    pub.publish('weixin', JSON.stringify(mes));
}
exports.pub_msg = function (mes) {
    console.log(mes)
    pub.publish('msg', JSON.stringify(mes));
}
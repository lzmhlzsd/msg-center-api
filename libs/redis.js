/**
 * Created by lukaijie on 16/5/30.
 */
var Redis = require('ioredis'),
    config = require('./config');
var redis = new Redis(config.redis);
var pub = new Redis(config.redis);
var email = require('./email');

var u = require('underscore');

var api_v1 = require('../controller/api_v1');

redis.on('message', function (channel, message) {
    var objmsg = JSON.parse(message);
    if (u.where(objmsg.type, 'email').length > 0) {
        email.send_email(objmsg)
    }
    console.log('Receive message %s from channel %s', message, channel);
});

redis.subscribe('notice', 'music', function (err, count) {
    pub.publish('news', 'Hello World!');
});
exports.pub = function (mes) {
    console.log(mes)
    pub.publish('notice', JSON.stringify(mes));
}
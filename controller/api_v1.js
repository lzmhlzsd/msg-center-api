/**
 * Created by lkj on 2016/8/6.
 */
var utool = require('../libs/utool'),
    md5 = require('MD5'),
    redis = require('../libs/redis'),
    logger = require('../libs/logger');
exports.sendNotice = function (data) {
    redis.pub(data);
}
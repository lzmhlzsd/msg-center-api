/**
 * Created by lkj on 2016/8/6.
 */
var utool = require('../libs/utool'),
    md5 = require('MD5'),
    redis = require('../libs/redis'),
    u = require('underscore'),
    logger = require('../libs/logger');
exports.sendNotice = function (data) {
    var sqlInfo = {
        method: 'sendNotice',
        memo: '查询用户信息',
        params: {
            c_appkey: data.system.app_key
        },
        desc: ""
    }
    utool.sqlExect('SELECT * FROM t_user t1\
    LEFT JOIN t_config t2 ON t1.c_userid = t2.c_userid WHERE t1.c_appkey = ?', [sqlInfo.params.appkey], sqlInfo, function (err, result) {
        if (err) {
            logger.info('查询用户信息：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
        }
        else {
            if (result.length > 0) {
                u.extend(data, {user: result[0]});
            }
            //查询发送人员的信息
            var userno = '';
            //data.notice_to
            u.each(data.notice_to, function (value, key) {
                userno = userno + '"' + value + '"';
                if (key < data.notice_to.length - 1) {
                    userno = userno + ',';
                }
            });
            utool.sqlExect('SELECT * FROM msg_center.t_member WHERE c_userno IN (?);', [userno], sqlInfo, function (err, result1) {
                if (err) {
                    logger.info('查询发送人员的信息：' + JSON.stringify(err));
                    res.send({
                        status: '-1000',
                        message: JSON.stringify(err)
                    });
                }
                else {
                    u.extend(data, {member: result1});
                    if (u.where(data.type, 'email').length > 0) {
                        redis.pub_email(data);
                    }
                    if (u.where(data.type, 'weixin').length > 0) {
                        redis.pub_weixin(data);
                    }
                    if (u.where(data.type, 'msg').length > 0) {
                        redis.pub_msg(data);
                    }
                }
            });
        }
    });
}
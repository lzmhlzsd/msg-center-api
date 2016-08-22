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
    LEFT JOIN t_config t2 ON t1.c_userid = t2.c_userid WHERE t1.c_appkey = ?', [sqlInfo.params.c_appkey], sqlInfo, function (err, result) {
        if (err) {
            logger.info('查询用户信息：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
        }
        else {
            //console.log('result :' + result.length)
            if (result.length > 0) {
                u.extend(data, {user: result[0]});
            }
            //查询发送人员的信息
            var userno = '';
            //data.notice_to
            u.each(data.params.notice_to, function (value, key) {
                userno = userno + '"' + value + '"';
                if (key < data.params.notice_to.length - 1) {
                    userno = userno + ',';
                }
            });
            utool.sqlExect('SELECT * FROM t_member WHERE c_userno IN (' + userno + ')', null, sqlInfo, function (err, result1) {
                if (err) {
                    logger.info('查询发送人员的信息：' + JSON.stringify(err));
                    res.send({
                        status: '-1000',
                        message: JSON.stringify(err)
                    });
                }
                else {
                    u.extend(data, {member: result1});
                    //根据userid 和 templateid 查询模板内容
                    utool.sqlExect('SELECT c_temp_content FROM t_template WHERE c_temp_no = ? AND c_temp_userid = ?', [data.params.notice_tepmlate, data.user.c_userid], sqlInfo, function (err, result2) {
                        if (err) {
                            logger.info('根据userid 和 templateid 查询模板内容：' + JSON.stringify(err));
                            res.send({
                                status: '-1000',
                                message: JSON.stringify(err)
                            });
                        }
                        else {
                            u.extend(data, {templatecontent: result2[0].c_temp_content});
                            if (u.indexOf(data.params.type, 'email') >= 0) {
                                redis.pub_email(data);
                            }
                            if (u.indexOf(data.params.type, 'weixin') >= 0) {
                                redis.pub_weixin(data);
                            }
                            if (u.where(data.params.type, 'msg') >= 0) {
                                redis.pub_msg(data);
                            }
                        }
                    });


                }
            });
        }
    });
}
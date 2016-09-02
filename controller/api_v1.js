/**
 * Created by lkj on 2016/8/6.
 */
var utool = require('../libs/utool'),
    md5 = require('MD5'),
    redis = require('../libs/redis'),
    code = require('../libs/errors').code,
    moment = require('moment'),
    u = require('underscore'),
    logger = require('../libs/logger');
exports.sendNotice = function (data, callback) {
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
            //res.send({
            //    status: '-1000',
            //    message: JSON.stringify(err)
            //});
            callback(err);
            return;
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
                    //res.send({
                    //    status: '-1000',
                    //    message: JSON.stringify(err)
                    //});
                    callback(err);
                    return;
                }
                else {
                    if (result1.length == 0 || result1.length != data.params.notice_to.length) {
                        //发送人员编号错误
                        callback(null, '发送人员编号错误', '5000');
                        return;
                    }
                    u.extend(data, {member: result1});
                    //根据userid 和 templateid 查询模板内容
                    utool.sqlExect('SELECT c_temp_content FROM t_template WHERE c_temp_no = ? AND c_temp_userid = ?', [data.params.notice_tepmlate, data.user.c_userid], sqlInfo, function (err, result2) {
                        if (err) {
                            logger.info('根据userid 和 templateid 查询模板内容：' + JSON.stringify(err));
                            //res.send({
                            //    status: '-1000',
                            //    message: JSON.stringify(err)
                            //});
                            callback(err);
                            return;
                        }
                        else {
                            if (result2.length == 0) {
                                //模版编号错误
                                callback(null, '消息模板编号不存在', '5000');
                                return;
                            }
                            u.extend(data, {
                                templatecontent: result2[0].c_temp_content,
                                create_time: moment().format('YYYY-MM-DD HH:mm:ss')
                            });
                            //校验服务是否可用(是否已获得,并且在有效时间内)
                            utool.sqlExect('SELECT * FROM t_user_service WHERE c_userid = ?', [data.user.c_userid], sqlInfo, function (err, result3) {
                                if (err) {
                                    logger.info('查询服务是否可用：' + JSON.stringify(err));
                                    callback(err);
                                    return;
                                }
                                else {
                                    //email: 1; weixin: 2; msg: 3;
                                    u.extend(data, {access: result3}); // 服务权限
                                    if (u.indexOf(data.params.type, 'email') >= 0) {
                                        redis.pub_email(data);
                                        //utool.checkService(1, result3, function (flag, msg) {
                                        //    if (flag) {
                                        //        //redis.pub_email(data);
                                        //    }
                                        //    else {
                                        //        //写日志
                                        //        utool.writeNoticeLog(data.user, 'email', template(msg.params.notice_data), msg.err);
                                        //        //console.log('email:' + msg)
                                        //        callflag = callflag && false;
                                        //        emialflag = false;
                                        //        callback(null, msg, '5000');
                                        //        return;
                                        //    }
                                        //})
                                    }
                                    if (u.indexOf(data.params.type, 'weixin') >= 0) {
                                        redis.pub_weixin(data);
                                    }
                                    if (u.where(data.params.type, 'msg') >= 0) {
                                        redis.pub_msg(data);
                                    }
                                    callback(null, null, '0000');
                                }
                            })
                        }
                    });
                }
            });
        }
    });
}


//SELECT c_create_time,COUNT(c_create_time)
//FROM msg_center.t_notice_log  where  c_create_time >='2016-09-01' and c_create_time < '2016-9-2'
//group by c_create_time

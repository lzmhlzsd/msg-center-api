/**
 * Created by lukaijie on 16/5/12.
 */
var pool = require('./mysql'),
    logger = require('./logger'),
    moment = require('moment');
var u = require("underscore");


module.exports = {
    reqErr: function (error, response, res, result, callback) {
        if (!error && response.statusCode == 200) {
            if (result.result == 'error') {
                res.render('common/error', {
                    message: result.error.message,
                    error: result.error.message,
                    status: result.error.code
                });
            }
            else {
                callback();
            }
        }
        else {
            res.render('common/error', {
                message: error != null ? error.message : response.statusMessage,
                error: error,
                status: 500
            });
        }
    },
    errView: function (res, message, code) {
        res.render('common/error', {
            message: message,
            error: message,
            status: code || 500
        });
    },
    format: function (string, args) {
        return string.replace(/\{(\d+)\}/g, function (s, i) {
            return args[i];
        });
    },
    checkSession: function (session) {
        if (typeof(session.shopexid) != 'undefined') {
            if (session.shopexid != "") {
                return true
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    sqlExect: function (sql, data, errinfo, callback) {
        pool.acquire(function (err, client) {
            if (err) {
                einfo = u.extend(errinfo, {err: err});
                logger.error(einfo.method, einfo.memo, einfo.params, JSON.stringify(einfo.err));
                callback(err);
            }
            else {
                client.query(sql, data, function (err, result) {
                    pool.release(client);
                    if (err) {
                        einfo = u.extend(errinfo, {err: err});
                        logger.error(einfo.method, einfo.memo, einfo.params, JSON.stringify(einfo.err));
                        callback(err);
                    }
                    else {
                        callback(null, result);
                    }
                })
            }
        });
    },
    writeNoticeLog: function (msg, type, content, errinfo) {
        var self = this;
        var members = '';

        u.each(msg.member, function (item, index) {
            members = members + item.c_name;
            if (index < msg.member.length - 1) {
                members = members + ',';
            }
        })

        var insertdata = '("' + msg.system.app_key + '","' +
            type + '","' +
            content + '","' +
            members + '",' +
            (typeof err != 'undefined' ? 0 : 1) + ",'" +
            (typeof err != 'undefined' ? JSON.stringify(errinfo) : '') + "')";
        console.log(JSON.stringify(errinfo));
        var sqlInfo = {
            method: 'writeNoticeLog',
            memo: '插入消息日志',
            params: {
                insertdata: insertdata
            },
            desc: '插入消息日志'
        }
        self.sqlExect('INSERT INTO t_notice_log (c_appkey, c_type, c_content, c_notice_to, c_status, c_desc) VALUES ' + sqlInfo.params.insertdata, null, sqlInfo, function (err, result) {
            if (err) {
                logger.info('插入消息日志：' + JSON.stringify(err));
            }
            else {
                //update t_notice_total 表中的统计数据
                var today = moment().format('YYYY-MM-DD');
                //查询表中是否有当日的记录
                self.sqlExect('SELECT * FROM t_notice_total WHERE c_appkey = ? AND c_date = ?', [msg.system.app_key, today], null, function (err, result1) {
                    if (err) {
                        logger.info('查询表中是否有当日的记录：' + JSON.stringify(err));
                    }
                    else {
                        if (result1.length == 0) {
                            var email_success = 0, email_fail = 0;
                            var msg_success = 0, msg_fail = 0;
                            var weixin_success = 0, weixin_fail = 0;

                            switch (type) {
                                case "email":
                                    if (errinfo) {
                                        email_fail = 1;
                                    }
                                    else {
                                        email_success = 0;
                                    }
                                    break;
                                case  "msg":
                                    if (errinfo) {
                                        msg_fail = 1;
                                    }
                                    else {
                                        msg_success = 0;
                                    }
                                    break;
                                case  "weixin":
                                    if (errinfo) {
                                        weixin_fail = 1;
                                    }
                                    else {
                                        weixin_success = 0;
                                    }
                                    break;
                            }
                            var insertdata_total = '("' + msg.system.app_key + '","' +
                                today + '",' +
                                email_success + ',' + email_fail + ',' +
                                msg_success + ',' + msg_fail + ',' +
                                weixin_success + ',' + weixin_fail + ')';
                            console.log('INSERT INTO t_notice_total (c_appkey,c_date,c_email_success,c_email_fail,\
                                c_msg_success,c_msg_fail,c_weixin_success,c_weixin_fail) VALUES ' + insertdata_total);
                            self.sqlExect('INSERT INTO t_notice_total (c_appkey,c_date,c_email_success,c_email_fail,\
                                c_msg_success,c_msg_fail,c_weixin_success,c_weixin_fail) VALUES ' + insertdata_total, null, null, function (err, result1) {
                                if (err) {
                                    logger.info('消息统计表插入记录：' + JSON.stringify(err));
                                }
                                else {

                                }
                            })
                        }
                        else {
                            console.log(result1);
                            var n_email_success = result1[0].c_email_success, n_email_fail = result1[0].c_email_fail;
                            var n_msg_success = result1[0].c_msg_success, n_msg_fail = result1[0].c_msg_fail;
                            var n_weixin_success = result1[0].c_weixin_success, n_weixin_fail = result1[0].c_weixin_fail;
                            switch (type) {
                                case "email":
                                    if (errinfo) {
                                        n_email_fail++;
                                    }
                                    else {
                                        n_email_success++;
                                    }
                                    break;
                                case  "msg":
                                    if (errinfo) {
                                        n_msg_fail++;
                                    }
                                    else {
                                        n_msg_success++;
                                    }
                                    break;
                                case  "weixin":
                                    if (errinfo) {
                                        n_weixin_fail++;
                                    }
                                    else {
                                        n_weixin_success++;
                                    }
                                    break;
                            }
                            console.log('UPDATE t_notice_total SET c_email_success = ' + n_email_success + ',c_email_fail = ' + n_email_fail +
                                ',c_msg_success = ' + n_msg_success + ',c_msg_fail = ' + n_msg_fail +
                                ', c_weixin_success = ' + n_weixin_success + ', c_weixin_fail = ' + n_weixin_fail + ' WHERE c_appkey = "' + msg.system.app_key + '" AND c_date = "' + today + '"');

                            self.sqlExect('UPDATE t_notice_total SET c_email_success = ?, c_email_fail = ?,\
                                c_msg_success = ?, c_msg_fail = ?,\
                                c_weixin_success = ?, c_weixin_fail = ? WHERE c_appkey = ? AND c_date = ?', [n_email_success, n_email_fail,
                                n_msg_success, n_msg_fail, n_weixin_success, n_weixin_fail, msg.system.app_key, today], null, function (err, result1) {
                                if (err) {
                                    logger.info('消息统计表更新记录：' + JSON.stringify(err));
                                }
                                else {
                                }
                            })
                        }
                    }
                })
            }
        });
    },
    checkService: function (servicetype, serviceInfo, callback) {
        var list = u.where(serviceInfo, {c_serviceid: servicetype});
        if (list.length > 0) { //存在已经申请的服务信息
            redis.pub_email(data);
            //检查是否已经获得该服务
            if (list[0].c_service_status == 2) {   //已经获得该服务
                //检查服务时候已经过有效期
                if (moment().isBefore(list[0].c_dead_time)) {
                    callback(true);
                }
                else {
                    callback(false, {
                        service: list[0].c_servicename,
                        err: '服务已经过期,请重新申请'
                    });
                }
            }
            else {
                callback(false, {
                    service: list[0].c_servicename,
                    err: '该服务没有审批通过'
                });
            }
        }
        else {
            callback(false, {
                service: list[0].c_servicename,
                err: '没有申请该服务'
            });
        }
    },
    //随机字符串
    randomString: function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
}
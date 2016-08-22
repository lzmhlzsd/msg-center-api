/**
 * Created by lukaijie on 16/5/12.
 */
var pool = require('./mysql'),
    logger = require('./logger');
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
    writeNoticeLog: function (msg, type, content, err) {

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
            (typeof err != 'undefined' ? 0 : 1) + ',"' +
            (typeof err != 'undefined' ? JSON.stringify(err) : '') + '")';

        var sqlInfo = {
            method: 'writeNoticeLog',
            memo: '插入消息日志',
            params: {
                insertdata: insertdata
            },
            desc: '插入消息日志'
        }
        console.log('INSERT INTO t_notice_log (c_appkey, c_type, c_content, c_notice_to, c_status, c_desc) VALUES ' + sqlInfo.params.insertdata);
        this.sqlExect('INSERT INTO t_notice_log (c_appkey, c_type, c_content, c_notice_to, c_status, c_desc) VALUES ' + sqlInfo.params.insertdata, null, sqlInfo, function (err, result) {
            if (err) {
                logger.info('插入消息日志：' + JSON.stringify(err));
            }
            else {

            }
        });
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
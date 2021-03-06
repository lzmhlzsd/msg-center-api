/**
 * Created by lukaijie on 16/5/13.
 */
var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    code = require('../libs/errors').code,
    md5 = require('MD5'),
    redis = require('../libs/redis'),
    logger = require('../libs/logger');

var api_v1 = require('./api_v1');

/**
 * @method 调用API
 * @author lukaijie
 * @datetime 16/5/19
 */
exports.requestAPI = function (req, res) {
    var Info = {
        method: 'requestAPI',
        memo: '调用API',
        params: {
            system: {
                ver: req.body.system.ver,
                app_key: req.body.system.appkey,
                app_sign: req.body.system.sign
            },
            method: req.body.method,
            params: req.body.params
        },
        desc: ""
    }
    checkSign(Info, res, function (result) {
        if (result) {
            switch (Info.params.system.ver) {
                case '1.0':
                    api_v1[Info.params.method](Info.params, function (err, msg, status_code, data) {
                        console.log('返回码:', status_code);
                        console.log(msg);
                        if (err) {
                            res.send({
                                status: '-1000',
                                message: JSON.stringify(err)
                            });
                        }
                        else {
                            if (status_code == '0000') {
                                if (typeof  data != 'undefined') {
                                    res.send({
                                        status: status_code,
                                        data: data,
                                        message: code[status_code]
                                    })
                                }
                                else {
                                    res.send({
                                        status: status_code,
                                        message: code[status_code]
                                    })
                                }
                            }
                            else {
                                res.send({
                                    status: status_code,
                                    data: msg,
                                    message: code[status_code]
                                })
                            }
                        }
                    });
                    break;
            }
            //res.send({
            //    status: '0000',
            //    message: code['0000']
            //})
        }
    });
}


/**
 * @method 验证签名
 * @author lkj
 * @datetime 2016/8/6
 */
function checkSign(Info, res, callback) {
    //通过appkey查询screct
    var sqlInfo = {
        method: 'checkSign',
        memo: '验证签名',
        params: {
            ver: Info.params.system.ver,
            appkey: Info.params.system.app_key,
            sign: Info.params.system.app_sign,
            method: Info.params.method,
            //timestamp: Info.params.timestamp, //时间戳
            params: Info.params.params
        },
        desc: ""
    }
    utool.sqlExect('SELECT * FROM t_user WHERE c_appkey= ?', [sqlInfo.params.appkey], sqlInfo, function (err, result) {
        if (err) {
            logger.info('根据appkey查询用户信息：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
        }
        else {
            if (result.length == 0) { //
                res.send({
                    status: '5005',
                    message: code['5005']
                })
                return;
            }
            else {
                //console.log(sqlInfo.params.appkey + result[0].c_appscrect + sqlInfo.params.method)
                var sign = md5(sqlInfo.params.appkey + result[0].c_appscrect + sqlInfo.params.method);
                //console.log('sign:' + sign);
                //console.log(sqlInfo.params.sign);
                if (sqlInfo.params.sign == sign) { //验证成功
                    //switch (sqlInfo.params.ver) {
                    //    case '1.0':
                    //        api_v1[sqlInfo.params.method](sqlInfo.params.params, res);
                    //        break;
                    //}
                    //res.send({
                    //    status: '0000',
                    //    message: code['0000']
                    //})
                    callback(true);
                }
                else {
                    res.send({
                        status: '5006',
                        message: code['5006']
                    })
                    return;
                }
            }
        }
    });
}

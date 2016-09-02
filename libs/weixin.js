/**
 * Created by lukaijie on 16/8/18.
 */
var nodemailer = require('nodemailer'),
    u = require('underscore'),
    moment = require('moment'),
    utool = require('./utool'),
    logger = require('../libs/logger');

var API = require('wechat-enterprise').API;

exports.send_notice = function (msg) {
    console.log(msg);

    console.log(msg.user.c_weixin_qyh_cropid);
    console.log(msg.user.c_weixin_qyh_screct);
    console.log(msg.user.c_weixin_qyh_agentid);
    try {
        //校验服务
        utool.checkService(3, msg.access, function (flag, errInfo) {
            var api = new API(msg.user.c_weixin_qyh_cropid, msg.user.c_weixin_qyh_screct, msg.user.c_weixin_qyh_agentid);

            u.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };
            var template = u.template(msg.templatecontent);

            var to = {
                touser: msg.params.notice_to.join('|'),
                toparty: '',
                totab: ''
            }, message = {
                msgtype: "text",
                text: {
                    "content": '【' + msg.user.c_customer + '】' + template(msg.params.notice_data)
                },
                safe: "0"
            };
            if (flag) {


                /**
                 * 发送消息分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
                 * 详细请看：http://qydev.weixin.qq.com/wiki/index.php?title=发送接口说明
                 * Examples:
                 * ```
                 * api.send(to, message, callback);
                 * ```
                 * To:
                 * ```
                 * {
 *  "touser": "UserID1|UserID2|UserID3",      成员ID列表,消息接受者
 *  "toparty": " PartyID1 | PartyID2 ",       部门列表
 *  "totag": " TagID1 | TagID2 "              标签列表
 * }
                 * ```
                 * Message:
                 * 文本消息：
                 * ```
                 * {
 *  "msgtype": "text",
 *  "text": {
 *    "content": "Holiday Request For Pony(http://xxxxx)"
 *  },
 *  "safe":"0"
 * }



                 * ```
                 * Callback:
                 *
                 * - `err`, 调用失败时得到的异常
                 * - `result`, 调用正常时得到的对象
                 *
                 * Result:
                 * ```
                 * {
 *  "errcode": 0,
 *  "errmsg": "ok",
 *  "invaliduser": "UserID1",
 *  "invalidparty":"PartyID1",
 *  "invalidtag":"TagID1"
 * }
                 * ```
                 *
                 * @param {Object} to 接受消息的用户
                 * @param {Object} message 消息对象
                 * @param {Function} callback 回调函数
                 */
                    //utool.writeNoticeLog(msg, 'weixin', template(msg.params.notice_data));
                api.send(to, message, function (err, result) {
                    if (err) {
                        //发送失败
                        utool.writeNoticeLog(msg, 'weixin', template(msg.params.notice_data), err);
                        logger.info('发送微信消息：' + JSON.stringify(err));
                        return;
                    }
                    else {
                        //发送成功
                        utool.writeNoticeLog(msg, 'weixin', template(msg.params.notice_data));
                        logger.info('微信发送成功');
                    }
                });
            }
            else {
                //失败
                utool.writeNoticeLog(msg, 'weixin', template(msg.params.notice_data), errInfo.err);
            }
        });

    }
    catch (e) {
        utool.writeNoticeLog(msg, 'weixin', '', e.toString());
    }
}
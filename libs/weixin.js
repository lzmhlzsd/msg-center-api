/**
 * Created by lukaijie on 16/8/18.
 */
var nodemailer = require('nodemailer'),
    u = require('underscore'),
    moment = require('moment');

exports.send_notice = function (msg) {
    console.log(msg);
    var transporter = nodemailer.createTransport({
        host: msg.user.c_emial_host, //"smtp.qq.com", // 主机
        secureConnection: true, // 使用 SSL
        port: msg.user.c_email_port, //465, // SMTP 端口
        auth: {
            user: msg.user.c_email_username, //"332847979@qq.com", // 账号
            pass: msg.user.c_email_password  //"cyokedaiptaicacf" // 密码
        }
    });

    console.log(req.session['user'].qyh_cropid);
    console.log(req.session['user'].qyh_screct);
    console.log(req.session['user'].qyh_agentid);
    var api = new API(req.session['user'].qyh_cropid, req.session['user'].qyh_screct, req.session['user'].qyh_agentid);


    var to = {
        touser:'',
        toparty:'',
        totab:''
    }, message = {};

    u.each(msg.member, function (value, key) {

    })


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

    api.send(to, message, function (err, result) {
        if (err) {
            //发送失败
            logger.info('发送微信消息：' + JSON.stringify(err));
            return;
        }
        else {
            //发送成功
        }
    });
}
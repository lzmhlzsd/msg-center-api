/**
 * Created by lukaijie on 16/9/2.
 */

//exports.send_notice = function (msg) {
//    //发送短信
//}

var smsProvider = require('yunpian-sms-client').v2,
    u = require('underscore'),
    moment = require('moment'),
    utool = require('./utool'),
    logger = require('../libs/logger');


//var text = '【斑彰科技】今日产量#num#，完成率#ratio#，报废率#scrap#';
//var text = '【斑彰科技】今日产量100，完成率80%，报废率1.5%';
//var mobile = '13917609856';

exports.send_notice = function (msg) {
    console.log(msg);

    console.log(msg.user.c_msg_apikey);
    try {
        utool.checkService(2, msg.access, function (flag, errInfo) {
            var apiKey = msg.user.c_msg_apikey;
            var provider = smsProvider.initWithKey(apiKey);

            u.templateSettings = {
                //interpolate: /\{\{(.+?)\}\}/g
                interpolate: /\#(.+?)\#/g
            };
            var template = u.template(msg.templatecontent);

            var msgto = [];
            u.each(msg.member, function (value, key) {
                msgto.push(value.c_mobile);
            });
            //批量发送
            provider.sendBatchSms({mobile: msgto.toString(), text: template(msg.params.notice_data)}).then(function (result) {
                if (result) {
                    console.log(result);
                    utool.writeNoticeLog(msg, 'msg', template(msg.params.notice_data));
                    console.log('短信发送成功');
                }
            }).catch(function (err) {
                console.log(err);
                utool.writeNoticeLog(msg, 'msg', template(msg.params.notice_data), err);
            });
        });
    }
    catch (e) {
        utool.writeNoticeLog(msg, 'msg', '', e.toString());
    }
}
//单条信息发送
//provider.sendSingleSms({
//    mobile: mobile,
//    text: text,
//    uid: '234'
//}).then(function (result) {
//    if (result) {
//        console.log(result);
//    }
//}).catch(function (err) {
//    console.log(err);
//});

//获取所有模版
//provider.getSmsTpl().then(function (result) {
//    if (result) {
//        console.log(result);
//    }
//}).catch(function (err) {
//    console.log(err);
//});

//批量发送
//provider.sendBatchSms({mobile:'13917609856,18221741738',text:text}).then(function(result){
//    if(result){
//        console.log(result);
//    }
//}).catch(function(err){
//    console.log(err);
//});
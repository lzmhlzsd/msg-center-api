/**
 * Created by lkj on 2016/8/5.
 */
var nodemailer = require('nodemailer'),
    u = require('underscore'),
    utool = require('./utool'),
    moment = require('moment');


//var mailOptions = {
//    from: '332847979@qq.com ', // sender address
//    to: 'lukaijie2006@sina.com', // list of receivers
//    subject: 'Hello ✔', // Subject line
//    text: 'Hello world ✔', // plaintext body
//    html: '<b>Hello world ✔</b>' // html body
//};


exports.send_notice = function (msg) {
    //console.log(msg);
    //var transporter = nodemailer.createTransport({
    //    host: msg.user.c_email_host, //"smtp.qq.com", // 主机
    //    secureConnection: true, // 使用 SSL
    //    port: msg.user.c_email_port, //465, // SMTP 端口
    //    auth: {
    //        user: msg.user.c_email_username, //"332847979@qq.com", // 账号
    //        pass: msg.user.c_email_password  //"cyokedaiptaicacf" // 密码
    //    }
    //});
    try {
        //校验服务
        utool.checkService(2, msg.access, function (flag, message) {
            var transporter = nodemailer.createTransport({
                host: msg.user.c_email_host, //"smtp.qq.com", // 主机
                secureConnection: true, // 使用 SSL
                port: msg.user.c_email_port, //465, // SMTP 端口
                auth: {
                    user: msg.user.c_email_username, //"332847979@qq.com", // 账号
                    pass: msg.user.c_email_password  //"cyokedaiptaicacf" // 密码
                }
            });

            u.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };
            var template = u.template(msg.templatecontent);


            var emailto = [];
            u.each(msg.member, function (value, key) {
                emailto.push(value.c_email);
            });

            var mailOptions = {
                from: msg.user.c_email_username, //'332847979@qq.com', // sender address
                to: emailto.toString(), // list of receivers
                subject: msg.params.notice_subject, // Subject line
                text: msg.params.notice_subject + '(' + msg.params.notice_text + ')', // plaintext body
                html: template(msg.params.notice_data) // html body
            };
            console.log(mailOptions)

            if (flag) {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        utool.writeNoticeLog(msg, 'email', template(msg.params.notice_data), error);
                        console.log(error);
                    } else {
                        utool.writeNoticeLog(msg, 'email', template(msg.params.notice_data));
                        console.log('邮件发送成功: ' + info.response);
                    }
                });
            }
            else {
                utool.writeNoticeLog(msg, 'email', template(msg.params.notice_data), message.err);
            }
        });
    }
    catch (e) {
        utool.writeNoticeLog(msg, 'weixin', '', e.toString());
    }
}
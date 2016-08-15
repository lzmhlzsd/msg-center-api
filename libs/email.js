/**
 * Created by lkj on 2016/8/5.
 */
var nodemailer = require('nodemailer'),
    u = require('underscore'),
    moment = require('moment');

var transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 主机
    secureConnection: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
        user: "332847979@qq.com", // 账号
        pass: "cyokedaiptaicacf" // 密码
    }
});

//var mailOptions = {
//    from: '332847979@qq.com ', // sender address
//    to: 'lukaijie2006@sina.com', // list of receivers
//    subject: 'Hello ✔', // Subject line
//    text: 'Hello world ✔', // plaintext body
//    html: '<b>Hello world ✔</b>' // html body
//};


exports.send_email = function (msg) {
    console.log(msg)
    u.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
    var template = u.template(msg.notice_tepmlate);
    var mailOptions = {
        from: '332847979@qq.com', // sender address
        to: 'lukaijie2006@sina.com', // list of receivers
        subject: msg.notice_subject, // Subject line
        text: msg.notice_subject + '(' + msg.notice_text + ')', // plaintext body
        html: template(msg.notice_data) // html body
    };
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}
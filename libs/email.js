/**
 * Created by lkj on 2016/8/5.
 */
var nodemailer = require('nodemailer'),
    u = require('underscore'),
    moment = require('moment');


//var mailOptions = {
//    from: '332847979@qq.com ', // sender address
//    to: 'lukaijie2006@sina.com', // list of receivers
//    subject: 'Hello ✔', // Subject line
//    text: 'Hello world ✔', // plaintext body
//    html: '<b>Hello world ✔</b>' // html body
//};


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

    u.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
    var template = u.template(msg.notice_tepmlate);


    var emailto = [];
    u.each(msg.member, function (value, key) {
        emailto.push(value.c_email);
    });

    var mailOptions = {
        from: msg.user.c_email_username, //'332847979@qq.com', // sender address
        to: emailto.toString(), // list of receivers
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
/**
 * Created by lukaijie on 16/9/2.
 */

//exports.send_notice = function (msg) {
//    //发送短信
//}

var smsProvider = require('yunpian-sms-client').v2;
var apiKey = '8ecc10f0e2d7af479c8c365a619f785f';
var provider = smsProvider.initWithKey(apiKey);

//var text = '【斑彰科技】今日产量#num#，完成率#ratio#，报废率#scrap#';
var text = '【斑彰科技】今日产量100，完成率80%，报废率1.5%';
var mobile = '13917609856';


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
provider.getSmsTpl().then(function (result) {
    if (result) {
        console.log(result);
    }
}).catch(function (err) {
    console.log(err);
});

//批量发送
//provider.sendBatchSms({mobile:'13917609856,18221741738',text:text}).then(function(result){
//    if(result){
//        console.log(result);
//    }
//}).catch(function(err){
//    console.log(err);
//});
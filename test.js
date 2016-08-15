/**
 * Created by lkj on 2016/8/7.
 */
var request = require('request');

for (var i = 0; i < 10; i++) {
    request.post({
        url: 'http://127.0.0.1:8009/api',
        json: true,
        headers: {
            'content-type': 'application/json'
        }
    }, {
        "system": {
            "ver": "1.0",
            "appkey": "hei3HsJ",
            "sign": "672490853c15bb7a56e2f2104508118d"
        },
        "method": "sendNotice",
        "params": {
            "type": [
                "email"
            ],
            "notice_tepmlate": "hello, {{name}}",
            "notice_data": {
                "name": "lkj" + i
            },
            "notice_to": [
                "1001",
                "1002"
            ],
            "notice_subject": "消息主题",
            "notice_text": "消息备注"
        }
    }, function (error, response, result) {
        if (!error && response.statusCode == 200) {
            console.log('ok' + i);
        }
        else {
            console.log('error' + i);
        }
    });
}
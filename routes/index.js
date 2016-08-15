var apiCtrl = require('../controller/apiCtrl'),
    testCtrl = require('../controller/testCtrl'),
    config = require('../libs/config'),
    practice = require('../libs/practice'),
    u = require("underscore");

module.exports = function (app) {

    /** start:api **/
    app.post('/api',apiCtrl.requestAPI);

    app.get('/',function(req,res){
        res.send('调用成功')
    })

    app.get('/test',testCtrl.test);
    /** end:api **/
}


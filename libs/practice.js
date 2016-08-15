/**
 * Created by lukaijie on 16/5/12.
 */
exports.checkSession = function (req, res, next) {
    console.log('进入session验证:' + JSON.stringify(req.session.user));
    if (typeof(req.session.user) != 'undefined') {
        next();
    }
    else {
        res.redirect('/');
    }
}
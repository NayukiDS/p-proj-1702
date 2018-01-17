var request = require('request');

var app_id = "wxb3d399c7ffef9be4";
var secret = "39835e71b39145dd305d49ede6d6b413";

function apply_auth_wechat(js_code) {
    this.res_str = undefined;
    var that = this;
    this.do_exec = function (callback) {
        request("https://api.weixin.qq.com/sns/jscode2session?" +
            "appid=" + app_id + "&" +
            "secret=" + secret + "&" +
            "js_code=" + js_code + "&" +
            "grant_type=authorization_code",
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // console.log(body);
                    that.res_str = body;
                    callback();
                }
            });
        this.getResult = function () {
            return that.res_str;
        }
    }
}

module.exports = apply_auth_wechat;
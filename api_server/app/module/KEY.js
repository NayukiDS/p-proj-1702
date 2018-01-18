var redis = require('redis');
var redis_info = require('../models/redis_connection');
var client = redis.createClient(redis_info.port, redis_info.address);

client.on("error", function (err) {
    console.log("Error " + err);
});

var crypto = require('crypto');
var key = '430a632b45129vo4';
var iv = '2624750004598718';

var encrypt = function (key, iv, data) {
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var crypted = cipher.update(data, 'utf-8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
};

var  decrypt = function (key, iv, crypted) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf-8');
    return decoded;
};

function KEY(api_key) {
    this.key = api_key;
    var key_data = {
        client: "",//wechat web web_a

    };
    var that = this;
    this.getOID = function () {
        return "abcd";
    }
}

module.exports = KEY;
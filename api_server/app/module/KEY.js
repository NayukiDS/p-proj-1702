var redis = require('redis');
var redis_info = require('../models/redis_connection');
var client = redis.createClient(redis_info.port, redis_info.address);

client.on("error", function (err) {
    console.log("Error " + err);
});

var crypto = require('crypto');
var key = '430a632b45129vo4';
var iv = '2624750004598718';

// var encrypt = function (data) {
//     var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
//     var data_crypted = cipher.update(data, 'utf-8', 'binary');
//     data_crypted += cipher.final('binary');
//     data_crypted = new Buffer(data_crypted, 'binary').toString('base64');
//     return data_crypted;
// };
//
// var decrypt = function (data_crypted) {
//     data_crypted = new Buffer(data_crypted, 'base64').toString('binary');
//     var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
//     var decoded = decipher.update(data_crypted, 'binary', 'utf8');
//     decoded += decipher.final('utf-8');
//     return decoded;
// };

function KEY(api_key) {
    this.key_data = {
        client: undefined,//wechat web web_a
        user_id: undefined,
        open_id: undefined,
        timestamp: 0
    };
    this.key = api_key;
    var that = this;
    if(api_key){
        this.reset_key_data();
    }
    this.encrypt = function () {
        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        var data_crypted = cipher.update(JSON.stringify(that.key_data), 'utf-8', 'binary');
        data_crypted += cipher.final('binary');
        data_crypted = new Buffer(data_crypted, 'binary').toString('base64');
        return data_crypted;
    };
    this.reset_key = function () {
        that.key = that.encrypt();
    };
    this.decrypt = function () {
        that.key = new Buffer(that.key, 'base64').toString('binary');
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decoded = decipher.update(that.key, 'binary', 'utf8');
        decoded += decipher.final('utf-8');
        return decoded;
    };
    this.reset_key_data = function () {
        var data_obj = JSON.parse(that.decrypt());
        that.key_data.client = data_obj.client;
        that.key_data.user_id = data_obj.user_id;
        that.key_data.open_id = data_obj.open_id;
        that.key_data.timestamp = data_obj.timestamp;
    };
    this.getAPI_KEY = function (client, user_id, open_id) {
        that.key_data.client = client;
        that.key_data.user_id = user_id;
        that.key_data.open_id = open_id;
        that.key_data.timestamp = Date.now();
        return that.encrypt();
    };
    this.getOID = function () {
        return that.key_data.open_id;
    }
}

module.exports = KEY;

// var a = {a:false,b:2,c:3};
// var b = encrypt(JSON.stringify(a));
// var c = decrypt(b);
// c = JSON.parse(c);
// console.log(a);
// console.log(b);
// console.log(!c.a);

client.quit();
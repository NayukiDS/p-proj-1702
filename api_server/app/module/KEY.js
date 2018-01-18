var redis = require('redis');
var redis_info = require('../models/redis_connection');
var client = redis.createClient(redis_info.port, redis_info.address, redis_info.option);



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
    this.res_sessionSave = undefined;
    this.res_sessionCheck = undefined;
    var that = this;
    // if(api_key){
    //     that.reset_key_data();
    // }
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
    this.decrypt = function (api_key) {
        if(!api_key)api_key = that.key;
        var decoded;
        try{
            api_key = new Buffer(api_key, 'base64').toString('binary');
            var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            decoded = decipher.update(api_key, 'binary', 'utf8');
            decoded += decipher.final('utf-8');
        }catch (e){
            return false;
        }
        return decoded;
    };
    this.reset_key_data = function () {
        var data_obj;// = JSON.parse(that.decrypt());
        try{
            var decoded = that.decrypt();
            if(!decoded){
                return false;
            }
            data_obj = JSON.parse(decoded);
        }catch (e){
            return false;
        }
        that.key_data.client = data_obj.client;
        that.key_data.user_id = data_obj.user_id;
        that.key_data.open_id = data_obj.open_id;
        that.key_data.timestamp = data_obj.timestamp;
        return true;
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
    };
    this.getUser_id = function () {
        return that.key_data.user_id;
    };
    this.sessionSave = function (user_id, user_client, api_key, callback) {
        var res_json = {
            err: false,
            err_msg: ""
        };
        if(!user_id)user_id = that.key_data.user_id;
        if(!user_client)user_client = that.key_data.client;
        if(!api_key)api_key = that.key;
        // var valid_ts = Date.now() + 10800000;//3hour
        client.on("error", function (err) {
            res_json.err = true;
            res_json.err_msg = err;
            // client.quit();
            that.res_sessionSave = res_json;
        });
        // client.set(api_key, valid_ts, function(err) {
        client.set(user_id+user_client, api_key, function(err) {
            if(err){
                res_json.err = true;
                res_json.err_msg = err;
                // client.quit();
                that.res_sessionSave = res_json;
            }else{
                // client.quit();
                that.res_sessionSave = res_json;
            }
            callback();
        });
    };
    this.getRes_sessionSave = function () {
        return that.res_sessionSave;
    };
    this.sessionCheck = function (api_key, callback) {
        var res_json = {
            err: false,
            err_msg: "",
            valid: false
        };
        if(!api_key){
            res_json.err = true;
            res_json.err_msg = "invalid api_key";
            that.res_sessionCheck = res_json;
            return;
        }
        var valid_ts;
        client.on("error", function (err) {
            res_json.err = true;
            res_json.err_msg = err;
            client.quit();
            that.res_sessionCheck = res_json;
        });
        client.get(api_key, function (err, reply) {
            if(err){
                res_json.err = true;
                res_json.err_msg = err;
                client.quit();
                that.res_sessionCheck = res_json;
            }else{
                valid_ts = parseInt(reply);
                if(valid_ts>Date.now())res_json.valid = true;
                client.quit();
                that.res_sessionCheck =  res_json;
            }
        });
    };
    this.getRes_sessionCheck = function () {
        return that.res_sessionCheck;
    };
    this.sessionAbort = function () {

    };
}

module.exports = KEY;
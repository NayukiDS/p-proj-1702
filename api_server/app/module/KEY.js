function KEY(api_key) {
    this.key = api_key;
    var that = this;
    this.getOID = function () {
        return "abcd";
    }
}

module.exports = KEY;
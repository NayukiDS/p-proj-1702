function InfoJSON() {
    this.office = null;
    this.phone = null;
    this.email = null;
    var that = this;
    this.setter = function (v_office, v_phone, v_email) {
        that.office = v_office;
        that.phone = v_phone;
        that.email = v_email;
    };
    this.exportJSON = function () {
        return {
            office: that.office,
            phone: that.phone,
            email: that.email
        };
    };
}

module.exports = InfoJSON;
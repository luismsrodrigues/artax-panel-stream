function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

function validateIpAndPort(input) {
    if(input){
        var parts = input.split(":");
        var ip = parts[0].split(".");
        var port = parts[1];
        return validateNum(port, 1, 65535) &&
            ip.length == 4 &&
            ip.every(function (segment) {
                return validateNum(segment, 0, 255);
            });
    }else{
        return false;
    }
}

module.exports = {
    OBS_PROVIDER: {
        Connected: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            }
        },
        Errors: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            }
        },
    },
    CSGO:{
        Running: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            }
        },
        Server: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            }
        },
        State: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            }
        },
        Errors: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            }
        },
    },
}
var Service;
var Characteristic;
var HomebridgeAPI;
var http = require('http');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HomebridgeAPI = homebridge;

    homebridge.registerAccessory("homebridge-http-motion", "http-motion", HTTPMotion);
};


function HTTPMotion(log, config) {
    this.log = log;
    this.name = config.name;
    this.port = config.port;
    this.motionDetected = false;
    this.timeout = null;

    this.repeater = config.repeater || [];

    var that = this;
    this.server = http.createServer(function(request, response) {
        that.httpHandler(that);
        response.end('Successfully requested: ' + request.url);
    });



    // info service
    this.informationService = new Service.AccessoryInformation();
        
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, "Hersteller")
        .setCharacteristic(Characteristic.Model, config.model || "Modell")
        .setCharacteristic(Characteristic.SerialNumber, config.serial || "Seriennummer");




    this.service = new Service.Motion(this.name);

    this.service.getCharacteristic(Characteristic.MotionDetected)
        .on('get', this.getState.bind(this));

    this.server.listen(this.port, function(){
        that.log("Motion server listening on: http://<your ip goes here>:%s", that.port);
    });
}


HTTPMotion.prototype.getState = function(callback) {
    callback(null, this.motionDetected);
};

HTTPMotion.prototype.httpHandler = function(that) {
    that.log("motion detected");

    for (var i = 0; i < that.repeater.length; i++) {
        // that.log("reflecting to " + that.repeater[i]);
        http.get(that.repeater[i], function(res) {
            // one could do something with this information
        });
    }

    that.motionDetected = true;
    that.service.getCharacteristic(Characteristic.MotionDetected)
        .updateValue(that.motionDetected, null, "httpHandler");
    if (that.timeout) clearTimeout(that.timeout);
    that.timeout = setTimeout(function() {
        that.motionDetected = false;
        that.service.getCharacteristic(Characteristic.MotionDetected)
            .updateValue(that.motionDetected, null, "httpHandler");
        that.timeout = null;
    }, 11 * 1000);
};

HTTPMotion.prototype.getServices = function() {
    return [this.informationService, this.service];
};

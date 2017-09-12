var Service;
var Characteristic;
var HomebridgeAPI;
var http = require('http');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HomebridgeAPI = homebridge;

    homebridge.registerAccessory("homebridge-http-motion-sensor", "http-motion-sensor", HTTPMotionSensor);
};


function HTTPMotionSensor(log, config) {
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
        .setCharacteristic(Characteristic.Manufacturer, "PIR Manufacturer")
        .setCharacteristic(Characteristic.Model, config.model || "HC-SR501")
        .setCharacteristic(Characteristic.SerialNumber, config.serial || "4BD53931-D4A9-4850-8E7D-8A51A842FA29");




    this.service = new Service.MotionSensor(this.name);

    this.service.getCharacteristic(Characteristic.MotionDetected)
        .on('get', this.getState.bind(this));

    this.server.listen(this.port, function(){
        that.log("Motion sensor server listening on: http://<your ip goes here>:%s", that.port);
    });
}


HTTPMotionSensor.prototype.getState = function(callback) {
    callback(null, this.motionDetected);
};

HTTPMotionSensor.prototype.httpHandler = function(that) {
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

HTTPMotionSensor.prototype.getServices = function() {
    return [this.informationService, this.service];
};
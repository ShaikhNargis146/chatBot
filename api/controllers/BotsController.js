module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var baseUrl = 'https://api.dialogflow.com/v1/';
var controller = {
    chatmsgs: function (req, res) {
        console.log("inside chat");
        response = "This is a sample response from your webhook!"; //Default response from the webhook to show it's working
        res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
        res.send(JSON.stringify({
            "speech": response,
            "displayText": response
            //"speech" is the spoken version of the response, "displayText" is the visual version
        }));
    },
    searchText: function (req, res) {
        console.log("query", req.body.query);
        var radius = 16000;
        var sensor = false;
        var types = "restaurant";
        var keyword = "fast";
        var querystring = require("querystring");
        var https = require('https');
        var parameters = {};
        parameters.key = 'AIzaSyC2cMB4K6lnmacErJtGEBOJpJoNpZW1JIw';
        var queryBody = {
            "contexts": [],
            "lang": "en",
            "query": req.body.query,
            "sessionId": "12345",
            "timezone": "America/New_York"
        };
        var options = {
            method: 'post',
            body: queryBody, // Javascript object
            json: true, // Use,If you are sending JSON data
            url: baseUrl + 'query?v=20150910',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 6a45d07194ea44deafe1da15f020c71b'
            }
        };

        request(options, function (err, response1, body) {
            if (err) {
                console.log('Error :', err);
            } else {
                console.log(' Body :', body.result.parameters);
                parameters.types = body.result.parameters['type-of-locations'];
                parameters.sensor = false;
                parameters.radius = 16000;
                parameters.location = body.result.parameters['geo-city'];

                parameters.query = parameters.types + ' in ' + parameters.location;
                var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + parameters.query + '&key=AIzaSyC2cMB4K6lnmacErJtGEBOJpJoNpZW1JIw';
                console.log(url);
                https.get(url, function (response) {
                    var body = '';
                    response.on('data', function (chunk) {
                        body += chunk;
                    });

                    response.on('end', function () {
                        var places = JSON.parse(body);
                        console.log("Got body: ", body);

                        res.json(places.results);
                    });
                }).on('error', function (e) {
                    console.log("Got error: " + e.message);
                });
            }

        });


    },
    saveText: function (req, res) {
        console.log("query", req.body.text);
        var radius = 16000;
        var sensor = false;
        var types = "restaurant";
        var keyword = "fast";
        var querystring = require("querystring");
        var https = require('https');
        var parameters = {};
        parameters.key = 'AIzaSyC2cMB4K6lnmacErJtGEBOJpJoNpZW1JIw';
        var queryBody = {
            "contexts": [],
            "lang": "en",
            "query": req.body.text,
            "sessionId": "12345",
            "timezone": "America/New_York"
        };
        var options = {
            method: 'post',
            body: queryBody, // Javascript object
            json: true, // Use,If you are sending JSON data
            url: baseUrl + 'query?v=20150910',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 6a45d07194ea44deafe1da15f020c71b'
            }
        };
        request(options, function (err, response1, body) {
            if (err) {
                console.log('Error :', err);
                res.json({
                    value: false,
                    data: {
                        message: "Invalid Request"
                    }
                });
            } else {
                var botData = {};

                botData.text = req.body.text;
                botData.user = req.body.user;
                if (body.result.parameters) {
                    console.log(' Body :', body.result.parameters);
                    botData.intent = body.result.parameters;
                }
                if (req.body.text.includes('tushar') || req.body.text.includes('Tushar') || req.body.text.includes('TUSHAR')) {

                    asycn.waterfall([function (callback) {
                        Bots.findMatch(callback);
                    }, function (data, callback) {
                        var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + data.type + " in " + data.city + '&key=AIzaSyC2cMB4K6lnmacErJtGEBOJpJoNpZW1JIw';

                        https.get(url, function (response) {
                            var body = '';
                            response.on('data', function (chunk) {
                                body += chunk;
                            });
                            response.on('end', function () {
                                var places = JSON.parse(body);
                                console.log("Got body: ", body);
                                botData.botResponse = places.results;
                                Bots.saveData(botData, callback);
                            });
                        }).on('error', function (e) {
                            console.log("Got error: " + e.message);
                            callback(e);
                        });
                    }], res.callback);

                } else {
                    Bots.saveData(botData, res.callback);
                }
            }

        });
    },
    clearText: function (req, res) {
        console.log("query", req.body.text);
        if (req.body.text == "clear all") {
            Bots.remove({}, function (err, response) {
                if (err) {
                    console.log('Error :', err);
                    res.json({
                        value: false,
                        data: {
                            message: "Invalid Request"
                        }
                    });
                } else {
                    res.callback(null, "Removed");
                }
            });
        }
    },
    getAll: function (req, res) {
        Bots.getAll(res.callback);
    }
};

module.exports = _.assign(module.exports, controller);
var schema = new Schema({
    text: String,
    user: String,
    intent: {},
    botResponse: JSON
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Bots', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getAll: function (callback) {
        Bots.find().lean().exec(callback);
    },
    findCityFromChat: function (callback) {
        Bots.findOne({
            $and: [{
                "intent.geo-city": {
                    $exists: 1
                }
            }, {
                "intent.geo-city": {
                    $ne: ""
                }
            }]
        }).lean().sort({
            _id: -1
        }).exec(function (err, data) {
            console.log("City", data);
            if (err || _.isEmpty(data)) {
                callback(err);
            } else {
                callback(null, data.intent["geo-city"]);
            }
        });
    },
    findTypeFromChat: function (callback) {
        Bots.findOne({
            $and: [{
                "intent.type-of-locations": {
                    $exists: 1
                }
            }, {
                "intent.type-of-locations": {
                    $ne: ""
                }
            }]
        }).lean().sort({
            _id: -1
        }).exec(function (err, data) {
            console.log("Type", data);
            if (err || _.isEmpty(data)) {
                callback(err);
            } else {

                callback(null, data.intent["type-of-locations"]);
            }
        });
    },
    findMatch: function (callback) {
        async.parallel({
            city: function (callback) {
                Bots.findCityFromChat(callback);
            },
            type: function (callback) {
                Bots.findTypeFromChat(callback);
            }
        }, callback);
    },
    savePlaces: function (data, places, callback) {
        var maxFind = 5;
        var somePlaces = places.slice(0, maxFind);
        var botObj = Bots();
        botObj.user = Config.botName;
        botObj.text = "You may check the following places ...";
        botObj.botResponse = {};
        botObj.botResponse.data = data;
        botObj.botResponse.somePlaces = somePlaces;
        botObj.save(function (err, data) {
            callback(err, data);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);
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
            if (err || _.isEmpty(data)) {
                callback(err);
            } else {
                console.log(data);
                callback(data.intent["geo-city"]);
            }
        });
    },
    findTypeFromChat: function (callback) {
        Bots.findOne({
            $and: [{
                "type-of-locations": {
                    $exists: 1
                }
            }, {
                "type-of-locations": {
                    $ne: ""
                }
            }]
        }).lean().sort({
            _id: -1
        }).exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                callback(err);
            } else {
                console.log(data);
                callback(data.intent["type-of-locations"]);
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
    }
};
module.exports = _.assign(module.exports, exports, model);
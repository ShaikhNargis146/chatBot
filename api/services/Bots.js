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
    findAllCity: function (callback) {
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
            if (err) {
                callback(err);
            } else {
                callback(data.intent["geo-city"]);
            }
        });
    },
    findAllTypes: function (callback) {
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
            if (err) {
                callback(err);
            } else {
                callback(data.intent["type-of-locations"]);
            }
        });
    },
    findMatch: function (callback) {
        async.parallel({
            city: function (callback) {

            },
            type: function (callback) {}
        }, callback);
    }

};
module.exports = _.assign(module.exports, exports, model);
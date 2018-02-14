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
    }
};
module.exports = _.assign(module.exports, exports, model);
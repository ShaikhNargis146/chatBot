module.exports = _.cloneDeep(require("sails-wohlig-controller"));
const baseUrl = 'https://api.dialogflow.com/v1/';
var controller = {
    chatmsgs: function (req, res) {
        console.log("inside chat");
        response = "This is a sample response from your webhook!" //Default response from the webhook to show it's working
        res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
        res.send(JSON.stringify({
            "speech": response,
            "displayText": response
            //"speech" is the spoken version of the response, "displayText" is the visual version
        }));
    },
    searchText: function (req, res) {
        console.log("query", req.body.query)
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
        }
        var options = {
            method: 'post',
            body: queryBody, // Javascript object
            json: true, // Use,If you are sending JSON data
            url: baseUrl + 'query?v=20150910',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 7058d3ffdcc64a6c94cf46144191f243'
            }
        }

        request(options, function (err, response1, body) {
            if (err) {
                console.log('Error :', err);
            } else {
                console.log(' Body :', body.result.parameters)
                parameters.types = body.result.parameters['type-of-locations'];
                parameters.sensor = false;
                parameters.radius = 16000;
                parameters.location = body.result.parameters['geo-city'];

                parameters.query = parameters.types + ' in ' + parameters.location
                var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + parameters.query + '&key=AIzaSyC2cMB4K6lnmacErJtGEBOJpJoNpZW1JIw'
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
    // /////////////////////////////////////////////////////////////////////////////
    // Operations for entity types.
    // /////////////////////////////////////////////////////////////////////////////

    createEntityTypes: function (req, res) {
        console.log(req.body)
        if (req.body) {
            var entityData = {
                "name": req.body.name,
                "auto": true,
                "contexts": [],
                "responses": [{
                    "resetContexts": false,
                    "affectedContexts": [],
                    "parameters": [],
                    "messages": [{
                        "type": 0,
                        "speech": req.body.responseString
                    }],
                    "defaultResponsePlatforms": {},
                    "speech": []
                }],
                "priority": 500000,
                "cortanaCommand": {
                    "navigateOrService": "NAVIGATE",
                    "target": ""
                },
                "webhookUsed": true,
                "webhookForSlotFilling": false,
                "lastUpdate": 1517653812,
                "fallbackIntent": false,
                "events": [],
                "userSays": [{
                    "data": [{
                        "text": req.body.name
                    }],
                    "isTemplate": false,
                    "count": 0,
                    "updated": 1517653812,
                    "isAuto": false
                }],
                "followUpIntents": [],
                "templates": []
            }
            var options = {
                method: 'post',
                body: entityData, // Javascript object
                json: true, // Use,If you are sending JSON data
                url: baseUrl + 'intents?v=20150910',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 7058d3ffdcc64a6c94cf46144191f243'
                }
            }

            request(options, function (err, res, body) {
                if (err) {
                    console.log('Error :', err);
                } else {
                    console.log(' Body :', body)

                }

            });
        } else {

        }
    },

    listEntityTypes: function (projectId) {
        // Imports the Dialogflow library
        const dialogflow = require('dialogflow');

        // Instantiates clients
        const entityTypesClient = new dialogflow.EntityTypesClient();
        const intentsClient = new dialogflow.IntentsClient();

        // The path to the agent the entity types belong to.
        const agentPath = intentsClient.projectAgentPath(projectId);

        // The request.
        const request = {
            parent: agentPath,
        };

        // Call the client library to retrieve a list of all existing entity types.
        return entityTypesClient
            .listEntityTypes(request)
            .then(responses => {
                return responses[0];
            })
            .catch(err => {
                console.error('Failed to list entity types:', err);
            });
    },

    clearEntityTypes: function (projectId) {
        // List all entity types then delete all of them.
        return listEntityTypes(projectId).then(entityTypes => {
            return Promise.all(
                entityTypes.map(entityType => {
                    return deleteEntityType(entityType);
                })
            );
        });
    },

    deleteEntityType: function (entityType) {
        // [START dialogflow_delete_entity]
        // Imports the Dialogflow library
        const dialogflow = require('dialogflow');

        // Instantiates clients
        const entityTypesClient = new dialogflow.EntityTypesClient();

        // The request.
        const request = {
            name: entityType.name,
        };
        // Call the client library to delete the entity type.
        return entityTypesClient
            .deleteEntityType(request)
            .then(() => {
                console.log(`Entity type ${entityType.displayName} deleted`);
            })
            .catch(err => {
                console.error(
                    `Failed to delete entity type ${entityType.displayName}:`,
                    err
                );
            });
        // [END dialogflow_delete_entity]
    },

    showEntityTypes: function (projectId) {
        // List all entity types then delete all of them.
        return listEntityTypes(projectId).then(entityTypes => {
            return Promise.all(
                entityTypes.map(entityType => {
                    return getEntityType(entityType);
                })
            );
        });
    },

    getEntityType: function (entityType) {
        // Imports the Dialogflow library
        const dialogflow = require('dialogflow');

        // Instantiates client
        const entityTypesClient = new dialogflow.EntityTypesClient();

        // The request.
        const request = {
            name: entityType.name
        };

        // Call the client library to retrieve an entity type.
        return entityTypesClient
            .getEntityType(request)
            .then(responses => {
                console.log('Found entity type:');
                logEntityType(responses[0]);
            })
            .catch(err => {
                console.error(`Failed to get entity type ${entityType.displayName}`, err);
            });
    },

    updateEntityType: function (projectId, entityTypeId) {
        // Imports the Dialogflow library
        const dialogflow = require('dialogflow');

        // Instantiates client
        const entityTypesClient = new dialogflow.EntityTypesClient();

        // The path to the entity type to be updated.
        const entityTypePath = entityTypesClient.entityTypePath(
            projectId,
            entityTypeId
        );

        // UpdateEntityType does full snapshot update. For incremental update
        // fetch the entity type first then modify it.
        const getEntityTypeRequest = {
            name: entityTypePath,
        };

        entityTypesClient
            .getEntityType(getEntityTypeRequest)
            .then(responses => {
                const entityType = responses[0];
                // Add a new entity foo to the entity type.
                entityType.entities.push({
                    value: 'foo',
                    synonyms: ['foo']
                });
                const request = {
                    entityType: entityType,
                };

                return entityTypesClient.updateEntityType(request);
            })
            .then(responses => {
                console.log('Updated entity type:');
                logEntityType(responses[0]);
            })
            .catch(err => {
                console.error('Failed to update entity type', err);
            });
    },


};

module.exports = _.assign(module.exports, controller);
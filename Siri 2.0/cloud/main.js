var everyBlock = require('cloud/EveryBlock.js');

Parse.Cloud.define("getMetros", function(request, response) {
    parameters = {
        "url": "https://api.everyblock.com/content/?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274",
        "method": "GET",
        "body": {}
    };

    everyBlock.getObjects(parameters).then(function(httpResponse) {

        var Metro = Parse.Object.extend("Metro");
        
        for(var i = 0; i < httpResponse.length; i++) {
            var metro = new Metro();
            var metroJSON = httpResponse[i];
            for(property in metroJSON) {
                metro.set(property, metroJSON[property]);
            }
            
            metro.save(null, {
                success:function(result) {
                },
                error:function(metro, error) {
                }
            });
        }
        response.success("Got metros");
        }, function(httpResponse) {
            console.error(httpResponse);
            response.error(httpResponse);
        }
    );
});

Parse.Cloud.define("getSchemas", function(request, response) {

    parameters = {
        "url": "https://api.everyblock.com/content/chicago/schemas?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274",
        "method": "GET",
        "body": {}
    };

    everyBlock.getObjects(parameters).then(function(httpResponse) {

        var Schema = Parse.Object.extend("Schemas");

        var schemas = [];

        for(var i = 0; i < httpResponse.length; i++) {
            var schema = new Schema();
            console.log(httpResponse[i]);
            console.log(i);

            var schemaJSON = httpResponse[i];
            schema.set("city", "chicago");
            for(property in schemaJSON) {
                if(property === "id") {
                    console.log("Caught id #: " + i);
                    schema.set("schemaId", schemaJSON[property] + '');
                }
                else {
                    schema.set(property, schemaJSON[property]);
                }
            }

            schemas.push(schema);
        }

        Parse.Promise.when(schemas.map(function(object) {
            object.save(null, {wait: true});
        }));

        response.success("Got schemas");
    }, function(httpResponse) {
        console.log(httpResponse);
        response.error(httpResponse);
    });
});

Parse.Cloud.beforeSave("OldSchemas", function(request, response) {

    var Schema = Parse.Object.extend("OldSchemas");
    var query = new Parse.Query(Schema);
    query.equalTo("city", request.object.get("city"));
    query.equalTo("schemaId", request.object.get("schemaId"));

    var query1 = new Parse.Query(Schema);
    query1.equalTo("schemaId", request.object.get("schemaId"));

    query.first({ 
        success: function(object) {
            if(object) {
                response.error("Schema already exists");
            }
            else {
                response.success();
            }
        }, error: function(error) {
            response.error("Error in query");
        }
    });
});

Parse.Cloud.beforeSave("Metro", function(request, response) {
    var query = new Parse.Query("Metro");
    query.equalTo("metro_name", request.object.get("metro_name"));
    query.first({
        success: function(object) {
            if (object) {
                response.error("Metro already exists");
            } else {
                response.success();
            }
        }, error: function(error) {
            response.error("Could not validate uniqueness for this BusStop object.");
        }
    });
});

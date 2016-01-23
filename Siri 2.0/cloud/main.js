var everyBlock = require('cloud/EveryBlock.js');

var Metro = Parse.Object.extend("Metro");

Parse.Cloud.define("getMetros", function(request, response) {
    parameters = {
        "url": "https://api.everyblock.com/content/?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274",
        "method": "GET",
        "body": {}
    };

    everyBlock.getObjects(parameters).then(function(httpResponse) {
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

        for(var i = 0; i < httpResponse.length; i++) {
            var schema = new Schema();

            var schemaJSON = httpResponse[i];
            schema.set("city", "chicago");
            for(property in schemaJSON) {
                if(property.localeCompare("id")) {
                    console.log(property);
                    schema.set(property, schemaJSON[property]);
                }
                else {
                    schema.set("schemaId", schemaJSON[property].toString());
                }
            }

            console.log(schema);
            console.log("One schema");

            schema.save(null, {
                success: function(result) {
                    console.log("Saved schemea");
                }, 
                error: function(schema, error) {
                    console.log(error.message);
                    response.error(error.message);
                }
            });
            console.log("Finished saving");
        }
        response.success("Got schemas");
    }, function(httpResponse) {
        console.log(httpResponse);
        response.error(httpResponse);
    });
});


Parse.Cloud.beforeSave("Hello", function(request, response) {
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

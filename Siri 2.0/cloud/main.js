var everyBlock = require('cloud/EveryBlock.js');

var Metro = Parse.Object.extend("Metro");

Parse.Cloud.define("getMetros", function(request, response) {
    everyBlock.getMetros().then(function(httpResponse) {
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
            response.error("Uh oh, something went wrong");
        }
    );
});

Parse.Cloud.define("getSchemas", function(request, response) {

    everyBlock.getSchemas(request.params.metro_name).then(function(httpResponse) {
        var Schema = new Parse.Object.extend("Schemas");
        for(var i = 0; i < httpResponse.length; i++) {
            var schema = new Schema();
            var schemaJSON = httpResponse[i];
            for(property in schemaJSON) {
                schema.set(property, schemaJSON[property]);
            }

            schema.save(null, {
                success: function(result) {
                }, 
                error:function(schema, error) {
                    console.log(error.message);
                }
            });
        }
        response.success("Got schemas");
    }, function(httpResponse) {
        console.error(httpResponse);
        response.error("Something went wrong");
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

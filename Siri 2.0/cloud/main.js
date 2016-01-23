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

Parse.Cloud.define("getNewsItems", function(request, response) {

    var city = "chicago"; //request.params.city;

    var url =  "https://api.everyblock.com/content/" + city + "/topnews?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274";

    if ('schema' in request.params) {
        url = url + "&schema=" + request.params.schema;
    }

    if ('url' in request.params) {
        url = request.params.url;
    }

    var parameters = {
        "url": url,
        "method": "GET",
        "body": {}
    };

    everyBlock.getObjects(parameters).then(function(httpResponse) {

        var NewsItem = Parse.Object.extend("NewsItems");
        var newsItems = [];
        var results = httpResponse['results'];

        for(var i = 0; i < results.length; i++) {
            var newsItem = new NewsItem();
            var newsItemJSON = results[i];

            newsItem.set("city", city);
            for(property in newsItemJSON) {
                if(property === "id") {
                    newsItem.set("newsItemId", newsItemJSON[property] + '');
                }
                else {
                    newsItem.set(property, newsItemJSON[property] + '');
                }
                for(subproperty in property) {
                    if(subproperty === "id") {
                        newsItem.set("subpropertyId", property[subproperty] + '');
                    }
                    else {
                        console.log(property);
                        console.log(property[subproperty]);
                        newsItem.set(subproperty, property[subproperty] + '');
                    }
                }
            }

            newsItems.push(newsItem);
        }
        Parse.Object.saveAll(newsItems, {
            success: function(objs) {
                console.log("Successfully saved " + newsItems.length);
            },
            error: function(error) { 
                console.log(error);
            }
        });
        Parse.Promise.when(newsItems.map(function(object) {
            object.save(null, {wait: true});
        }));
        
        console.log("FINISHED");

        if('next' in httpResponse) {
            var nextURL = httpResponse['next'];
            var params = {
                "url": nextURL,
                "city": city
            };
            Parse.Cloud.run("getNewsItems", params);
        }

        response.success("Got newsitems");
    }, function(httpResponse) {
        console.log(httpResponse);
        response.error(httpResponse);
    });
});


Parse.Cloud.define("getSchemas", function(request, response) {

    var city = request.params.city;

    parameters = {
        "url": "https://api.everyblock.com/content/" + city + "/schemas?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274",
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
            schema.set("city", city);
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
        
        Parse.Object.saveAll(schemas, {
            success: function(objs) {
                console.log("Successfully saved " + schemas.length);
            },
            error: function(error) { 
                console.log(error);
            }
        });
        Parse.Promise.when(schemas.map(function(object) {
            object.save(null, {wait: true});
        }));
        
        console.log("FINISHED");

        response.success("Got schemas");
    }, function(httpResponse) {
        console.log(httpResponse);
        response.error(httpResponse);
    });
});

Parse.Cloud.beforeSave("Schemas", function(request, response) {

    var Schema = Parse.Object.extend("Schemas");
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

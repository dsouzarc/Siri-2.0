module.exports = {

    getObjects:function(parameters, options) {
        requestURL = parameters["url"];
        requestBody = parameters["body"];
        requestType = parameters["method"];

        return Parse.Cloud.httpRequest({
            method: requestType,
            url: requestURL,
            body: requestBody,
        }).then(function(httpResponse) {
            return httpResponse.data;
            if(options && options.success) {
            }
        }, function(httpResponse) {
            console.log(httpResponse);
            if (options && options.error) {
                options.error(httpResponse);
            }
        });
    },

    getMetros: function(options) {
        return Parse.Cloud.httpRequest({
            method: "GET",
            url:"https://api.everyblock.com/content/?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274",
            body: {},
        }).then(function(httpResponse) {
            return httpResponse.data;
            if (options && options.success) {
            }
        }, function(httpResponse) {
            if (options && options.error) {
                options.error(httpResponse);
            }
        });
    },

    getSchemas: function(metroName, options) {
        return Parse.Cloud.httpRequest({
            method: "GET",
            url: "https://api.everyblock.com/content/" + metroName + "/topnews/?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274",
            body: {},
        }).then(function(httpResponse) {
            console.log(httpResponse);
            console.log("https://api.everyblock.com/content/" + metroName + "/schemas?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274");
            console.log("STILL HERE: " + httpResponse.status);
            console.log("STILL HERE: " + httpResponse);
            console.log("HERE: " + httpResponse.text);
            console.log("2HERE: " + httpResponse.data);
            return httpResponse.data;
            if(options && options.success) {
            }
        }, function(httpResponse) {
            if (options && options.error) {
                options.error(httpResponse);
            }
        });
    }
}

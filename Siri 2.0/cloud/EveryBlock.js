module.exports = {

    getObjects:function(parameters, options) {
        requestURL = parameters["url"];
        requestBody = parameters["body"];
        requestType = parameters["method"];

        return Parse.Cloud.httpRequest({
            method: requestType,
            url: requestURL,
            body: requestBody,
            followRedirects: true
        }).then(function(httpResponse) {
            return httpResponse.data;
            if(options && options.success) {
            }
        }, function(httpResponse) {
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

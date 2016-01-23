module.exports = {
    getMetros: function(options) {
        return Parse.Cloud.httpRequest({
            method: "GET",
            url:"https://api.everyblock.com/content/?token=fd5f0d8fc74fd048fbb811ee29215be5fef04274",
            body: {},
        }).then(function(httpResponse) {
          console.log("FINISHED with " + httpResponse.text);
          return httpResponse.data;
      if (options && options.success) {
      }
    }, function(httpResponse) {
      if (options && options.error) {
        options.error(httpResponse);
      }
    });
  }
}

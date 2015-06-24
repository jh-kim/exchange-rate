var Client = require('node-rest-client').Client;
var client_options = {
    mimetypes: {
      xml: ['application/xml', 'application/xml;charset=utf-8', 'application/xml; charset=utf-8', 'text/html; charset=UTF-8']
    }
  };
  var client = new Client(client_options);

var countries = require('./countries.json');

exports.Xchange = function (options) {
  var Util = {
      parseRate: function(from, to, title, fromAmount, source) {
        var T=Number(1e+6);
        var start = source.indexOf('=') + 2;
        var end = source.lastIndexOf(countries[to]) - 1;
        var exchangerate = source.slice(start, end);
        var exchangeResult = Math.round((exchangerate * fromAmount) * T) / T;
        return {from: from, to: to, title: title, exchangerate: exchangerate, fromAmount: fromAmount, toAmount: exchangeResult};
      }
  };
  
  this.getRate = function(from, to, amount, callback) {
    from = from.toLowerCase();
    if (to !== undefined) to = to.toLowerCase();
    client.get('http://' + from + '.fxexchangerate.com/rss.xml', function(data, response) {
      if (amount == null) {
        amount = 1;
      }
      var hasResult = false;
      var result = { statusCode: response.statusCode, message: 'SUCCESS', link: '', exchangeResults: []};
      if (response.statusCode === 200) {
        var toArray = [];
        var title = countries[from] + '(' + from.toUpperCase() + ')';
        if (to !== undefined) {
          toArray = to.split(',');
          if (toArray.length == 1) {
            title += '/' + countries[to] + '(' + to.toUpperCase() + ')';
          }
        }
        var channel = data.rss.channel[0];
        var items = channel.item;
        result.link = channel.link;
        
        items.forEach(function(item, index) {
          if (to !== undefined && toArray.length == 1) {
            if (item.title[0] === title) {
              hasResult = true;
              var exchangeResult = Util.parseRate(from, to, title, amount, item.description[0]);
              result.exchangeResults.push(exchangeResult);
              return;
            }
          } else {
            var keys = toArray.length > 1 ? toArray : Object.keys(countries);
            keys.forEach(function(key) {
              var tempTitle = title + '/' + countries[key] + '(' + key.toUpperCase() + ')';
              if (item.title[0] === tempTitle) {
                hasResult = true;
                var exchangeResult = Util.parseRate(from, key, tempTitle, amount, item.description[0]);
                result.exchangeResults.push(exchangeResult);
              }
            });
          }
        });
      }
      if (!hasResult) {
        result.message = 'Sorry Not Found';
      }
      callback.call(this, result);
    });
    return client;
  };
}

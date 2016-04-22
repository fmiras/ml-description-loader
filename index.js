var request = require('request-promise');
var options = require('./options');

function httpGet(url) {
  var httpoptions = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return request(httpoptions);
};

function httpPut(url, body) {
  var httpoptions = {
    method: 'PUT',
    uri: url,
    body: body,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return request(httpoptions);
};

var sellerProductsUrl = 'https://api.mercadolibre.com/sites/MLA/search?nickname={:sellerNickname}'.replace('{:sellerNickname}', options.sellerNickname);

console.log('Starting products-descriptions loading process...');

httpGet(sellerProductsUrl).then(function (data) {
  products = data.results;
  products.forEach(changeDescription);
});

function changeDescription(product) {
  var productUrl = 'https://api.mercadolibre.com/items/{:item_id}/description?access_token={:token}'.replace('{:item_id}', product.id).replace('{:token}', options.token);
  httpGet(productUrl).then(function (data) {
    data.text = data.text.replace(options.oldText, options.newText)
    httpPut(productUrl, data).then(function () {
      console.log('Updated product: ' + product.title);
    });
  });
};
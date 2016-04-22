var request = require('request-promise');

options = {
  sellerNickname : 'jm-motors',
  token : 'APP_USR-8981171931573837-042121-893bb2d0fd95efdb05ed227af14e6be1__N_M__-79670244',
  oldText : 'http://imageshack.com/a/img537/9265/oAGnVY.jpg',
  newText : 'http://www.subirimagenes.com/imagedata.php?url=http://s2.subirimagenes.com/imagen/9568050anunciomercadojmmoto.png',
};

function httpGet(url) {
  var options = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return request(options);
};

function httpPut(url, body) {
  var options = {
    method: 'PUT',
    uri: url,
    body: body,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  return request(options);
};

var sellerProductsUrl = 'https://api.mercadolibre.com/sites/MLA/search?nickname={:sellerNickname}'.replace('{:sellerNickname}', options.sellerNickname);

httpGet(sellerProductsUrl).then(function (data) {
  products = data.results;
  products.forEach(changeDescription);
});

function changeDescription(product) {
  var productUrl = 'https://api.mercadolibre.com/items/{:item_id}/description?access_token={:token}'.replace('{:item_id}', product.id).replace('{:token}', options.token);
  httpGet(productUrl).then(function (data) {
    data.text = data.text.replace(options.oldText, options.newText)
    httpPut(productUrl, data).then(function () {
      console.log('Se actualizó el producto: ' + product.title);
    });
  });
};
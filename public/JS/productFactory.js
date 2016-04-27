(function() {
  'use strict';
  angular.module('productFactory', [])
    .factory('productListFactory', productListFactory)

    productListFactory.$inject = ['$http']

  function productListFactory($http) {
    var productData = {},
      apiUrl = '/api/v1/products'

    productData.productList = function() {
      console.log('product list')
      return $http.get(apiUrl)
    }
    return productData
  }


}());

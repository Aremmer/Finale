;
(function() {
  'use strict'
  angular.module('authService', [])
    .factory('Auth', Auth)
    .factory('AuthInterceptor', AuthInterceptor)
    .factory('AuthToken', AuthToken)

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
// Token Factory
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
  function Auth($http, $q, AuthToken) {
    var authFactory = {}

    authFactory.login = function(email, password) {
      return $http.post('/api/v1/signIn', {
        email: email,
        password: password
      })
    }

    authFactory.logout = function() {
      AuthToken.setToken()
    }

    authFactory.isLoggedIn = function() {
      if (AuthToken.getToken()) {
        return true
      } else {
        return false
      }
    }

    authFactory.getUser = function() {
      if (AuthToken.getToken()) {
        return $http.get('/api/v1/me')
      } else {
        return $q.reject({
          message: 'User has no token'
        })
      }
    }

    return authFactory
  }

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
// Stores token in local storage in browser
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
  function AuthToken($window) {
    var authTokenFactory = {}

    authTokenFactory.getToken = function() {
      return $window.localStorage.getItem('token')
    }

    authTokenFactory.setToken = function(token) {
      if (token) {
        $window.localStorage.setItem('token', token)
      } else {
        $window.localStorage.removeItem('token')
      }
    }

    return authTokenFactory
  }

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
// Adds token to each server request
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
  function AuthInterceptor($q, AuthToken, $location) {
    console.log("AuthInterceptor Running")
    var interceptorFactory = {}

    interceptorFactory.request = function(config) {
      var token = AuthToken.getToken()

      if (token) {
        config.headers['x-access-token'] = token
      }

      return config
    }

    interceptorFactory.responseError = function(response) {
      if (response.status == 403) {
        $location.path('/')
      }
      return $q.reject(response)
    }
    return interceptorFactory
  }


}())

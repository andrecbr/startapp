// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic.contrib.drawer', 'gavruk.card', 'ion-affix', 'templates'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.backgroundColorByHexString('#387ef5');
      //StatusBar.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $logProvider, $compileProvider, $animateProvider) {

  // if in production
  if (true) {
    $logProvider.debugEnabled(false);
    $compileProvider.debugInfoEnabled(false);
  }

  $ionicConfigProvider.views.maxCache(5);

  $animateProvider.classNameFilter(/\banimated\b/);

  // natively comes activated
  $ionicConfigProvider.scrolling.jsScrolling(false);

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.config', {
      url: '/config',
      views: {
        'menuContent': {
          templateUrl: 'templates/config.html'
        }
      }
    })
    .state('app.feed', {
      url: '/feed',
      views: {
        'menuContent': {
          templateUrl: 'templates/feed.html',
          controller: 'FeedCtrl as vm'
        }
      }
    })
    .state('app.gallery', {
      url: '/gallery',
      views: {
        'menuContent': {
          templateUrl: 'templates/gallery.html',
          controller: 'GalleryCtrl as vm'
        }
      }
    })
    .state('app.contacts', {
      url: '/contacts',
      views: {
        'menuContent': {
          templateUrl: 'templates/contacts.html',
          controller: 'ContactsCtrl as vm'
        }
      }
    })
    .state('app.contact', {
      url: '/contacts/:contactId',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html'
        }
      }
    })
    .state('app.places', {
      url: '/places',
      views: {
        'menuContent': {
          templateUrl: 'templates/places.html',
          controller: 'PlacesCtrl as vm'
        }
      }
    })
    .state('app.place', {
      url: '/places/:placeId',
      views: {
        'menuContent': {
          templateUrl: 'templates/place.html',
          controller: 'PlaceCtrl as vm'
        }
      }
    })
    .state('app.checkout', {
      url: '/checkout',
      views: {
        'menuContent': {
          templateUrl: 'templates/checkout.html',
          controller: 'CheckoutCtrl as vm'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/gallery');
});
angular.module('starter.controllers', [])



  /**
   * @ngdoc function
   * @name starter.controller:AppCtrl
   * @description
   * # AppCtrl
   * Controller of the starter
   */
  .controller('AppCtrl', function($scope, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/incs/popover.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

  })



  /**
   * @ngdoc function
   * @name starter.controller:PlacesCtrl
   * @description
   * # PlacesCtrl
   * Controller of the starter
   */
  .controller('PlacesCtrl', function($scope) {
    var vm = this;
    $scope.$on('$ionicView.beforeEnter', function() {
      vm.places = [
        { title: 'Kafka Café', id: 1, thumbnail: 'https://unsplash.it/160/160?image=425' },
        { title: 'Hard Rock Cafe', id: 2, thumbnail: 'https://unsplash.it/160/160?image=836' },
        { title: 'Tomorrowland', id: 3, thumbnail: 'https://unsplash.it/160/160?image=646' },
        { title: 'Santa Monica Beach', id: 4, thumbnail: 'https://unsplash.it/160/160?image=851' }
      ];
    });
  })



  /**
   * @ngdoc function
   * @name starter.controller:GalleryCtrl
   * @description
   * # GalleryCtrl
   * Controller of the starter
   */
  .controller('GalleryCtrl', function($scope, $http, $timeout, $ionicScrollDelegate, $ionicBackdrop) {

    var vm = this,
        limit = 50,
        offset = 0;

    vm.images = [];
    vm.imagesLength = 0;
    vm.imageOpened = '';

    vm.closeImage = function (){
      vm.imageOpened = '';
      $timeout(function (){
        $ionicBackdrop.release();
      }, 300);
    };

    vm.openImage = function (url){
      vm.imageOpened = url;
      $ionicBackdrop.retain();
    };

    vm.busy = false;
    vm.loadMore = function (reset){
      vm.busy = true;
      if (reset){
        offset = 0;
        vm.posts = [];
      }
      $http.jsonp('https://api.tumblr.com/v2/blog/nonsense-case.tumblr.com/posts?limit='+limit+'&offset='+offset+'&api_key=ncc9oROiBppeeAacG7g75OB07Qy9f5PcrtGv4AwaEeD9gIhIbT&callback=JSON_CALLBACK')
        .then(function (response){
          vm.images.push(...response.data.response.posts);
          vm.imagesLength = vm.images.length;
          $ionicScrollDelegate.resize();
          vm.busy = false;
          offset += limit;
        }, function (error){
          $timeout(function (){
            vm.loadMore(false);
          }, 2000);
        }).finally(function (){
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    vm.refresh = function (){
      vm.loadMore(true);
    };

    $scope.$on('$stateChangeSuccess', function() {
      //vm.loadMore(false);
    });

    $scope.$on('$ionicView.beforeEnter', function() {
      vm.showMe = true;
    });
  })



  /**
   * @ngdoc function
   * @name starter.controller:PlaceCtrl
   * @description
   * # PlaceCtrl
   * Controller of the starter
   */
  .controller('PlaceCtrl', function($scope, $stateParams) {
  })



  /**
   * @ngdoc function
   * @name starter.controller:CheckoutCtrl
   * @description
   * # CheckoutCtrl
   * Controller of the starter
   */
  .controller('CheckoutCtrl', function($scope, $stateParams) {
    $scope.clear = function() {
      $scope.card = {};
    };
    $scope.clear();

    $scope.cardPlaceholders = {
      name: 'Your Full Name',
      number: 'XXXX XXXX XXXX XXXX',
      expiry: 'MM/YY',
      cvc: 'XXX'
    };

    $scope.cardMessages = {
      validDate: 'valid\nthru',
      monthYear: 'MM/YY',
    };

    $scope.cardOptions = {
      debug: false,
      formatting: true
    };

  })



  /**
   * @ngdoc function
   * @name starter.controller:FeedCtrl
   * @description
   * # FeedCtrl
   * Controller of the starter
   */
  .controller('FeedCtrl', function($scope, $http, $timeout, $ionicScrollDelegate) {
    /*
    var tumblr = require('tumblr.js');
    var client = tumblr.createClient({ consumer_key: 'ncc9oROiBppeeAacG7g75OB07Qy9f5PcrtGv4AwaEeD9gIhIbT' });

    // Make the request
    client.blogPosts('nonsense-case.tumblr.com', function(err, resp) {
      //console.log(resp.posts); // now we've got all kinds of posts
    });
    */
    var vm = this,
        //page = 1,
        limit = 10,
        offset = 0;


    vm.busy = false;
    vm.posts = [];
    vm.postsLength = 0;

    /**
     * browserify -r ./node_modules/tumblr.js/lib/tumblr.js:tumblr.js -o ./www/lib/tumblr.js
    **/
    vm.loadMore = function (reset){
      if (vm.busy){
        return;
      }
      vm.busy = true;
      /*$http.jsonp('http://www.wookmark.com/api/json/popular?callback=JSON_CALLBACK&page='+page)
        .then(function (response){
          vm.posts.push(...response.data);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          vm.busy = false;
          page++;
        });*/
      if (reset){
        offset = 0;
        vm.posts = [];
      }
      $http.jsonp('https://api.tumblr.com/v2/blog/nonsense-case.tumblr.com/posts?limit='+limit+'&offset='+offset+'&api_key=ncc9oROiBppeeAacG7g75OB07Qy9f5PcrtGv4AwaEeD9gIhIbT&callback=JSON_CALLBACK')
        .then(function (response){
          vm.posts.push(...response.data.response.posts);
          vm.postsLength = vm.posts.length;
          offset += limit;
          limit = 20;
        }, function (error){
          $timeout(function (){
            vm.loadMore(false);
          }, 2000);
        }).finally(function (){
          $ionicScrollDelegate.resize();
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
          vm.busy = false;
        });
    };

    vm.refresh = function (){
      vm.loadMore(true);
    };

    $scope.$on('$stateChangeSuccess', function() {
      //vm.loadMore(false);
    });

    $scope.$on('$ionicView.beforeEnter', function() {
      vm.showMe = true;
    });

  })

  .controller('ContactsCtrl', function($scope) {
    var vm = this;
        vm.busy = true;
        vm.currentTab = 0;

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      vm.slider = data.slider;
    });
    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
      vm.busy = true;
      vm.currentTab = data.slider.activeIndex;
    });
    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      $scope.$apply();
    });

    // call this function when data changes, such as an HTTP request, etc
    var dataChangeHandler = function (){
      if (vm.slider){
        vm.slider.update(true);
        //vm.slider.updateLoop();
        //$ionicSlideBoxDelegate.update();
      }
    };

    $scope.$watchGroup(['vm.currentTab','vm.slider'], function(newValues, oldValues, scope) {
      switch(newValues[0]){
        case 0:
          vm.busy = false;
          dataChangeHandler();
        break;
        case 1:
          vm.busy = false;
          dataChangeHandler();
        break;
        case 2:
          //
        break;
      }
    });

    $scope.$on('$ionicView.beforeEnter', function() {
      vm.contatos = [{
        id: 1,
        name: 'Anthony Howardd Pack',
        color: '#F7DBA7',
        photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/emirik/73.jpg',
        favorite: true,
        status: 1
      },{
        id: 2,
        name: 'John Doe',
        color: '#F1AB86',
        photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/spjpgrd/73.jpg',
        favorite: true,
        status: 1
      },{
        id: 3,
        name: 'Johnny Dope',
        color: '#C57B57',
        favorite: false,
        status: 0
      },{
        id: 4,
        name: 'Mark Markwelson',
        color: '#D66853',
        photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/73.jpg',
        favorite: false,
        status: 0
      },{
        id: 5,
        name: 'William Wallace',
        color: '#549F93',
        favorite: true,
        status: -1
      }];
    });

    /*vm.currentTab = 0;

    vm.tabsSlider = {
      options: {
        pagination: false,
        slidesPerView: 4,
        slideToClickedSlide: true,
        spaceBetween: 10,
        centeredSlides: true,
        onSlideChangeEnd: function (swiper){
          vm.currentTab = swiper.activeIndex;
          $scope.$apply();
        },
        onTap: function (swiper){
          vm.currentTab = swiper.clickedIndex;
          swiper.params.control.slideTo(vm.currentTab, 300, false);
          $scope.$apply();
        }
      },
      slider: null
    };

    vm.contentSlider = {
      options: {
        pagination: false,
        grabCursor: true,
        onSlideChangeEnd: function (swiper){
          vm.currentTab = swiper.activeIndex;
          $scope.$apply();
        }
      },
      slider: null
    };

    $scope.$watchGroup(['vm.tabsSlider.slider','vm.contentSlider.slider'], function(newValues, oldValues, scope) {
      if (newValues[0] && newValues[1]){
        newValues[0].params.control = newValues[1];
        newValues[1].params.control = newValues[0];
      }
    });*/
  });
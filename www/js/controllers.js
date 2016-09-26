angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopover) {
  $ionicPopover.fromTemplateUrl('templates/incs/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('FeedCtrl', function($scope, $http, $timeout) {
  /*
  var tumblr = require('tumblr.js');
  var client = tumblr.createClient({ consumer_key: 'ncc9oROiBppeeAacG7g75OB07Qy9f5PcrtGv4AwaEeD9gIhIbT' });

  // Make the request
  client.blogPosts('nonsense-case.tumblr.com', function(err, resp) {
    //console.log(resp.posts); // now we've got all kinds of posts
  });
  */

  if (window.StatusBar) {
    StatusBar.backgroundColorByHexString('#ffffff');
  }

  var vm = this,
      //page = 1,
      limit = 20,
      offset = 0,
      busy = false;

  vm.posts = [];

  vm.isBusy = function (){
    return busy;
  };

  /**
   * browserify -r ./node_modules/tumblr.js/lib/tumblr.js:tumblr.js -o ./www/lib/tumblr.js
  **/
  vm.loadMore = function (reset){
    busy = true;
    /*$http.jsonp('http://www.wookmark.com/api/json/popular?callback=JSON_CALLBACK&page='+page)
      .then(function (response){
        vm.posts.push(...response.data);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        busy = false;
        page++;
      });*/
    if (reset){
      offset = 0;
      vm.posts = [];
    }
    $http.jsonp('https://api.tumblr.com/v2/blog/nonsense-case.tumblr.com/posts?limit='+limit+'&offset='+offset+'&api_key=ncc9oROiBppeeAacG7g75OB07Qy9f5PcrtGv4AwaEeD9gIhIbT&callback=JSON_CALLBACK')
      .then(function (response){
        vm.posts.push(...response.data.response.posts);
        busy = false;
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
    vm.loadMore(false);
  });

})

.controller('BrowseCtrl', function($scope, $ionicSlideBoxDelegate, $timeout) {
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

  var randomColor = function (){
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  };

  vm.contatos = [{
    name: 'Anthony Howardd Pack',
    photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/emirik/73.jpg',
    favorite: true,
    status: 1
  },{
    name: 'John Doe',
    photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/spjpgrd/73.jpg',
    favorite: true,
    status: 1
  },{
    name: 'Johnny Dope',
    color: randomColor(),
    favorite: false,
    status: 0
  },{
    name: 'Mark Markwelson',
    photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/73.jpg',
    favorite: false,
    status: 0
  },{
    name: 'William Wallace',
    color: randomColor(),
    favorite: true,
    status: -1
  }];

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
});;

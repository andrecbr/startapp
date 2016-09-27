angular.module('starter')
	.directive('barTransparent', function ($document, $timeout) {
    var ionContent = [];
    return {
      restrict: 'C',
      link: function($scope) {
        $scope.$on('$ionicParentView.beforeLeave', function(){
          for (var i=ionContent.length-1; i>=0; --i){
            ionContent[i].classList.add('has-header');
            ionContent.splice(i, 1);
          }
        });
        $timeout(function (){
          var contents = $document[0].querySelectorAll('ion-content.has-header');
          if (!contents.length){
            return;
          }
          for (var i=0, j=contents.length; i<j; ++i){
            contents[i].classList.remove('has-header');
            ionContent.push(contents[i]);
          }
        });
      }
    }
	});
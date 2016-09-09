angular.module('starter')
	.directive('scrolling', function ($ionicPosition, $ionicScrollDelegate) {
		return {
			restrict: 'A',
			link: function ($scope, $element, $attr) {

				var lastScrollPosition = 0;

				$element.on('scroll', ionic.throttle(function (){
					var top = $ionicScrollDelegate.getScrollPosition().top;
					if (top > lastScrollPosition){
						var headerBars = document.querySelectorAll('ion-header-bar');
            for(var i=0, len=headerBars.length; i<len; ++i){
              headerBars[i].classList.add('off-canvas', 'off-canvas-y');
              $element.addClass('off-canvas').removeClass('has-header');
            }
            document.querySelector('.affix').classList.add('affix-top');
					}else{
						var headerBars = document.querySelectorAll('ion-header-bar.off-canvas-y');
            for(var i=0, len=headerBars.length; i<len; ++i){
              headerBars[i].classList.remove('off-canvas', 'off-canvas-y');
              $element.addClass('off-canvas').removeClass('has-header');
            }
            document.querySelector('.affix').classList.remove('affix-top');
					}
					//lastScrollPosition = $ionicScrollDelegate.getScrollPosition().top;
					lastScrollPosition = top;
				}, 200));
			}
		}
	});
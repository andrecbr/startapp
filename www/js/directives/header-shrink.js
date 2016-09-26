angular.module('starter')
	.directive('headerShrink', function ($document) {
	  var fadeAmt;

    var shrink = function(header, content, amt, max) {
      amt = Math.min(max, amt);
      fadeAmt = 1 - amt / max;
      ionic.requestAnimationFrame(function() {
        header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
        for(var i = 0, j = header.children.length; i < j; i++) {
          header.children[i].style.opacity = fadeAmt;
        }
      });
    };

    return {
      restrict: 'A',
      link: function($scope, $element, $attr, sticky) {
        var starty = $scope.$eval($attr.headerShrink) || 0,
            amt,
            y = 0,
            prevY = 0,
            scrollDelay = 0.4,
            fadeAmt,
            headers = $document[0].body.querySelectorAll('.bar-header'),
            headerHeight = headers[0].offsetHeight;

        $scope.$on('$ionicParentView.beforeEnter', function(){
          document.querySelector('ion-content').classList.add('top');
        });

        $scope.$on('$ionicParentView.beforeLeave', function(){
          document.querySelector('ion-content').classList.remove('top');
        });
        
        function onScroll(e) {
          var scrollTop = e.target.scrollTop || e.detail.scrollTop;

          if(scrollTop >= 0) {
            y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
          } else {
            y = 0;
          }

          ionic.requestAnimationFrame(function() {
            fadeAmt = 1 - (y / headerHeight);
            for(var i = 0, j = headers.length; i < j; ++i){
              document.querySelector('.fixed-top').style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + ((!y) ? y : '-54px') + ', 0)'; //header height
              headers[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
              for(var a = 0, x = headers[i].children.length; a < x; ++a) {
                headers[i].children[a].style.opacity = fadeAmt;
              }
            }
          });

          prevY = scrollTop;
        }

        $element.bind('scroll', onScroll);
      }
    }
	});
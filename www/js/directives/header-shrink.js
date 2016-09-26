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
            header = $document[0].body.querySelector('.bar-header'),
            headerHeight = header.offsetHeight;

        $scope.$on('$ionicParentView.beforeEnter', function(){
          var pane = document.querySelector('.menu-content');
          if (pane){
            pane.classList.add('animated');
          }
        });

        $scope.$on('$ionicParentView.beforeLeave', function(){
          var pane = document.querySelector('.pane-top');
          if (pane){
            pane.classList.remove('pane-top');
          }
          header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,0,0)';
        });
        
        function onScroll(e) {
          var scrollTop = e.target.scrollTop || e.detail.scrollTop;

          if(scrollTop >= 0) {
            y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
          } else {
            y = 0;
          }

          ionic.requestAnimationFrame(function() {
            var pane = document.querySelector('.menu-content');
            if (y){
              pane.classList.add('pane-top');
            }else{
              pane.classList.remove('pane-top');
            }
            /*fadeAmt = 1 - (y / headerHeight);
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
            for(var i = 0, j = header.children.length; i < j; i++) {
              header.children[i].style.opacity = fadeAmt;
            }*/
          });

          prevY = scrollTop;
        }

        $element.bind('scroll', onScroll);
      }
    }
	});
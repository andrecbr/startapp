(function() {

'use strict';

/**
 * The ionic-contrib-drawer is fly-out panel that unlike sidemenu appears over the top of content
 */
angular.module('ionic.contrib.drawer', ['ionic'])

.controller('drawerCtrl', ['$element', '$attrs', '$ionicGesture', '$ionicScrollDelegate', '$timeout', '$document', function($element, $attr, $ionicGesture, $ionicScrollDelegate, $timeout, $document) {

  var self = this;

  var el = $element[0];
  var dragging = false;
  var startX, lastX, offsetX, newX, startDragX;
  var side;

  // How far to drag before triggering
  var thresholdX = 15;
  // How far from edge before triggering
  var edgeX = 40;

  var LEFT = 0;
  var RIGHT = 1;

  var isTargetDrag = false;

  var width = $element[0].clientWidth;

  var clientWidth = window.innerWidth;

  self.init = function() {
    width = $element[0].clientWidth;
  }

  /** **/
  var $overlay = angular.element('<div class="drawer-overlay" />');
  var overlayEl = $overlay[0];
  /** **/

  var enableAnimation = function() {
    $element.addClass('animate');
    $overlay.addClass('animate');
  };
  var disableAnimation = function() {
    $element.removeClass('animate');
    $overlay.removeClass('animate');
  };

  self.opened = false;

  // Check if this is on target or not
  var isTarget = function(el) {
    while(el) {
      if(el === $element[0] || el === overlayEl) {
        return true;
      }
      el = el.parentNode;
    }
  };

  /** **/
  var overlayState = self.opened;
  
  $element.parent().prepend(overlayEl);
  
  var toggleOverlay = function(state) {
    if (overlayState !== state) {
      ionic.requestAnimationFrame(function() {
        var translateX = state === 0 ? '-100' : '0';
        overlayEl.style[ionic.CSS.TRANSFORM] = 'translate3d(' + translateX + '%, 0, 0)';
      });
      overlayState = state;
    }
  };
  /** **/

  var startDrag = function(e) {
    /*if (el.offsetParent === null){
      return;
    }*/
    if (document.querySelector('drawer') && document.querySelector('drawer').classList.contains('ng-hide')){
      return;
    }
    disableAnimation();
    toggleOverlay(true);

    dragging = true;
    offsetX = lastX - startX;
  };

  var startTargetDrag = function(e) {
    disableAnimation();
    toggleOverlay(true);
    
    dragging = true;
    isTargetDrag = true;
    offsetX = lastX - startX;
  };

  var doEndDrag = function(e) {
    startX = null;
    lastX = null;
    offsetX = null;
    isTargetDrag = false;

    if(!dragging) {
      return;
    }

    dragging = false;

    enableAnimation();

    var condition = (newX < (- width / 100 * 20));

    var opacity = ((condition) ? 0 : 1);

    if (side == RIGHT) {
      condition = (newX > (width / 100 * 20))
      opacity = ((condition) ? 0 : 1);
    }

    toggleOverlay(!condition);

    ionic.requestAnimationFrame(function() {
      overlayEl.style.opacity = opacity;
      if(condition) {
        self.close()
      } else {
        self.open()
      }
    });
  };

  var doDrag = function(e) {
    //debugger;
    if(e.defaultPrevented) {
      return;
    }

    if(!lastX) {
      startDragX = e.gesture.touches[0].pageX;
      startX = e.gesture.touches[0].pageX;
    }
    
    var position = el.getBoundingClientRect();

    lastX = e.gesture.touches[0].pageX;

    if (!dragging) {
      // Dragged 15 pixels and finger is by edge
      if (isTarget(e.target)) {
        startX = position.left;
        startTargetDrag(e);
        
      //} else if (Math.abs(lastX - startX) > thresholdX) {
      } else {
        if (side == RIGHT) {
          if (startX > edgeX) {
            startDrag(e);
          }
        } else {
          if (startX < edgeX) {
            startDrag(e);
          }
        }
      }
    } else {
      newX = Math.min(0, ((self.opened ? 0 : -width) + (lastX - offsetX)));
      var opacity = 1 + (newX / width);
      
      if (Math.abs(startDragX - lastX) > thresholdX) {
        $ionicScrollDelegate.freezeAllScrolls(true);
      }
        
      if (side == RIGHT) {
        newX = Math.max(0, width - (clientWidth - (lastX - offsetX)));
        opacity = opacity = 1 - (newX / width);
      }

      if (opacity < 0) {
        opacity = 0;
      }

      ionic.requestAnimationFrame(function() {
        overlayEl.style.opacity = opacity;
        el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
      });
    }

    if(dragging) {
      e.gesture.srcEvent.preventDefault();
    }
  };

  side = $attr.side == 'left' ? LEFT : RIGHT;

  if (side == RIGHT) {
    edgeX = clientWidth - edgeX
  }
  $ionicGesture.on('drag', function(e) {
    doDrag(e);
  }, $document);
  $ionicGesture.on('dragend', function(e) {
    $ionicScrollDelegate.freezeAllScrolls(false);
    doEndDrag(e);
  }, $document);


  this.close = function() {
    self.opened = false;

    enableAnimation();
    toggleOverlay(0);
    ionic.requestAnimationFrame(function() {
      overlayEl.style.opacity = 0;
      if(side === LEFT) {
        el.style.transform = el.style.webkitTransform = 'translate3d(-100%, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(100%, 0, 0)';
      }
    });

    $document[0].body.classList.remove('drawer-open');
  };

  this.open = function() {
    self.opened = true;

    $document[0].body.classList.add('drawer-open');
    
    enableAnimation();
    toggleOverlay(1);
    ionic.requestAnimationFrame(function() {
      overlayEl.style.opacity = 1;
      if(side === LEFT) {
        el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
      }
    });
    
  };

  $overlay.on('click', this.close);
}])

.directive('drawer', ['$rootScope', '$ionicGesture', function($rootScope, $ionicGesture) {
  return {
    restrict: 'E',
    controller: 'drawerCtrl',
    link: function($scope, $element, $attr, ctrl) {
      $element.addClass($attr.side);

      ctrl.init();

      var toggleBtns = document.querySelectorAll('[menu-toggle]');
      for (var i=0, len = toggleBtns.length; i < len; ++i){
        var el = angular.element(toggleBtns[i]);
        
        if (el.attr('menu-toggle') !== $attr.side){
          continue;
        }

        el.bind('click', function (){
          if (ctrl.opened){
            ctrl.close();
          }else{
            ctrl.open();
          }
        });
      }

      var closeBtns = document.querySelectorAll('[menu-close]');
      for (var i=0, len = closeBtns.length; i < len; ++i){
        angular.element(closeBtns[i]).bind('click', function (){
          ctrl.close();
        });
      }

      $scope.openDrawer = function() {
        ctrl.open();
      };
      $scope.closeDrawer = function() {
        ctrl.close();
      };
    }
  }
}])

.directive('drawerClose', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.bind('click', function() {
        var drawerCtrl = $element.inheritedData('$drawerController');
        drawerCtrl.close();
      });
    }
  }
}]);

})();
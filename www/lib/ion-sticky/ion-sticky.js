angular.module('ion-sticky', ['ionic'])
    .directive("onRepeatDone", function($timeout) {
        return {
            restriction: 'A',
            link: function($scope, element, attributes) {
                if ($scope.$last) {
                    $scope.$emit("ng_repeat_done", element);
                };
            }
        }
    })
    .directive('sticky', function($ionicScrollDelegate, $timeout, $interval, $compile) {
        var options,
            defaults = {
                classes: {
                    animated: 'item-animated',
                    container: 'item-wrapper',
                    hidden: 'item-hidden',
                    stationaryHeader: 'item item-avatar item-text-center item-divider item-borderless header-affix fixed-top'
                },
                selectors: {
                    groupContainer: 'item-container',
                    groupHeader: 'item-divider',
                    stationaryHeader: 'div'
                }
            };

        return {
            restrict: 'A',
            link: function(scope, element, attrs, ctrl) {
                scope.container_el = attrs.delegateHandle;

                scope.$watch(
                    attrs.watchVariable,
                    function handleModelChange(newValue) {
                        //we run this in a loop so we check to ensure the list is fully rendered
                        var stop = $interval(function() {
                            if (scope.list_render_completed === true) {
                                scope.list_render_completed = false;
                                $timeout(function() {
                                    console.log("updated list");
                                    scope.updateItems();
                                }, 500);
                                $interval.cancel(stop);
                            }
                        });
                    }, true
                );
                scope.$on('ng_repeat_done', function(domainElement) {
                    scope.list_render_completed = true;
                });

                var items = [],
                    options = angular.extend(defaults, attrs),
                    $element = angular.element(element),
                    $fakeHeader = angular.element('<div class="' + options.classes.stationaryHeader + '"/>'),
                    headerBars = [];

                scope.$on('$ionicParentView.beforeEnter', function(){
                    headerBars = document.querySelectorAll('ion-header-bar');
                    for(var i=0, len=headerBars.length; i<len; ++i){
                        headerBars[i].classList.add('has-tabs-top');
                    }
                });
                scope.$on('$ionicParentView.beforeLeave', function(){
                    //var headerBars = document.querySelectorAll('ion-header-bar.has-tabs-top');
                    for(var i=0, len=headerBars.length; i<len; ++i){
                        headerBars[i].classList.remove('has-tabs-top');
                    }
                });

                scope.updateItems = function() {
                    console.log("updateItems");
                    var $groupContainer = angular.element($element[0].getElementsByClassName(options.selectors.groupContainer));

                    $element.addClass('list-sticky');

                    angular.element($element[0].getElementsByClassName('list')).addClass(options.classes.container);

                    //$element.after($fakeHeader);
                    $element.parent()[0].insertBefore($fakeHeader[0], $element[0]);

                    items = [];
                    angular.forEach($groupContainer, function(elem, index) {
                        var $tmp_list = $groupContainer.eq(index);

                        var $tmp_listHeight = $tmp_list.prop('offsetHeight'),
                            $tmp_listOffset = $tmp_list[0].getBoundingClientRect().top,
                            $tmp_header = angular.element($tmp_list[0].getElementsByClassName(options.selectors.groupHeader)).eq(0);
                        if ($tmp_header.text().indexOf("{{") == -1) //not found
                            items.push({
                            'list': $tmp_list,
                            'header': $tmp_header,
                            'listHeight': $tmp_listHeight,
                            'headerText': $tmp_header.html(),
                            'headerHeight': $tmp_header.prop('offsetHeight'),
                            'listOffset': $tmp_listOffset,
                            'listBottom': $tmp_listHeight + $tmp_listOffset
                        });
                    });

                    $fakeHeader.html(items[0].headerText);
                };

                scope.checkPosition = function() {
                    var i = 0,
                        topElement, offscreenElement, topElementBottom,
                        currentTop = $ionicScrollDelegate.$getByHandle(scope.container_el).getScrollPosition().top;

                    topElement = items[0];

                    var delta = items[0].listOffset;

                    //while ((items[i].listOffset - currentTop) <= 0) {
                    console.log(items[i].listOffset, currentTop, items[i].listOffset - currentTop, delta);
                    while ((items[i].listOffset - currentTop) <= delta) {
                        //while ((items[i].listOffset ) <= 50) {
                        topElement = items[i];
                        topElementBottom = -(topElement.listBottom - currentTop);

                        if (topElementBottom < -topElement.headerHeight) {
                            offscreenElement = topElement;
                        }

                        //i++;

                        if (i++ >= items.length) {
                            i--;
                            break;
                        }
                    }

                    //$fakeHeader.text(topElement.headerText);
                    //delta += 30;
                    if (topElementBottom) {
                        if (topElementBottom + delta < 0 && topElementBottom + delta > -topElement.headerHeight) {
                            $fakeHeader.addClass(options.classes.hidden);
                            //angular.element(topElement.list).addClass(options.classes.animated);
                            var listElem = document.getElementById(angular.element(topElement.list).attr("id"));
                            listElem.className = listElem.className.replace(options.classes.animated, ""); // first remove the class name if that already exists
                            listElem.className = listElem.className + " " + options.classes.animated;
                        } else {
                            $fakeHeader.removeClass(options.classes.hidden);
                            if (topElement) {
                                //angular.element(topElement.list).removeClass(options.classes.animated);
                                var listElem = document.getElementById(angular.element(topElement.list).attr("id"));
                                listElem.className = listElem.className.replace(options.classes.animated, "");
                            }
                        }
                        $fakeHeader.html(topElement.headerText);
                    }
                };
            }

        }
    })
    .directive('headerShrink', function($document) {
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
          
          function onScroll(e) {
            var scrollTop = e.target.scrollTop || e.detail.scrollTop;

            if(scrollTop >= 0) {
              y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
            } else {
              y = 0;
            }

            ionic.requestAnimationFrame(function() {
              var pane = document.querySelector('.view-container');
              if (y){
                pane.classList.add('pane-top');
              }else{
                pane.classList.remove('pane-top');
              }
              fadeAmt = 1 - (y / headerHeight);
              header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
              for(var i = 0, j = header.children.length; i < j; i++) {
                header.children[i].style.opacity = fadeAmt;
              }
            });

            prevY = scrollTop;
          }

          $element.bind('scroll', onScroll);
        }
      }
    });
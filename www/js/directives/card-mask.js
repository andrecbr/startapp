angular.module('starter')
	.directive('cardMask', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, ctrl) {
      	$scope.$watch($attrs.ngModel, function (newValue){
      		if (!newValue) return;

      		var val = newValue,
				      len = val.split(' ').length-1;

				  if (val.length-1 >= 4 && len  === 0){
				    val = val.slice(0,4) + ' ' + val.slice(4);
				  }
				  if (val.length-1 >= 9 && len === 1){
				    val = val.slice(0,9) + ' ' + val.slice(9);
				  }
				  if (val.length-1 >= 14 && len === 2){
				    val = val.slice(0,14) + ' ' + val.slice(14);
				  }
				  ctrl.$setViewValue(val);
          ctrl.$render();
      	});
      }
    }
	})
	.directive('expDateMask', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, ctrl) {
      	$scope.$watch($attrs.ngModel, function (newValue){
      		if (!newValue) return;

      		var val = newValue,
				      len = val.split('/').length-1;

				  if (val.length-1 >= 2 && len  === 0){
				    val = val.slice(0,2) + '/' + val.slice(2);
				  }
				  ctrl.$setViewValue(val);
          ctrl.$render();
      	});
      }
    }
	});
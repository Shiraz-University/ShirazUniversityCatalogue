g_waiting_funcions = [];

function call_all_waiting_function()
{
	for (var x = 0; x < g_waiting_funcions.length; x++)
	{
		console.log("calling the load function!");
		(g_waiting_funcions[x])();
	}
}

angular.module('ionicApp.directives',['ngSanitize'])

.filter('unsafe', ['$sce', function($sce) {

    return function(text) {
    	console.log(text);
        return $sce.trustAsHtml(text);
    };
}])

.directive('ionslider',function($timeout){
	function createValues(){
		function formatMin(minString){
			if (minString.length == 1){
				return '0' + minString;
			}
			else{
				return minString;
			}
		}
		var baseMins = 7 * 60 + 30;
		var values = [];
		for (var i = 0; i <= 750; i+=15){
			var totalMins = i + baseMins;
			var hour = Math.floor(totalMins / 60);
			var min = totalMins % 60;
			values.push(hour.toString() + ':' + formatMin(min.toString()));
		}
		return values;
	}
    return{
        restrict:'E',
        scope:{min:'=',
            max:'=',
            type:'@',
            prefix:'@',
            maxPostfix:'@',
            prettify:'@',
            grid:'@',
            gridMargin:'@',
            postfix:'@',
            step:'@',
            hideMinMax:'@',
            hideFromTo:'@',
            from:'=',
            to:'=',
            disable:'=',
            onChange:'@',
            onFinish:'='

        },
        template:'<div></div>',
        replace:true,
        link:function($scope,$element,attrs){
            (function init(){
            	// console.log("??#$%#$%#$%");
            	// console.log($scope);
                $element.ionRangeSlider({
                    min: $scope.min,
                    max: $scope.max,
                    type: $scope.type,
                    prefix: $scope.prefix,
                    maxPostfix: $scope.maxPostfix,
                    prettify: $scope.prettify,
                    grid: $scope.grid,
                    gridMargin: $scope.gridMargin,
                    postfix:$scope.postfix,
                    step:$scope.step,
                    hideMinMax:$scope.hideMinMax,
                    hideFromTo:$scope.hideFromTo,
                    from:$scope.from,
                    to: $scope.to,
                    disable:$scope.disable,
                    onChange: function(data){
                    	$scope.from = data.from;
                    	$scope.to = data.to;
                    	$scope.$apply();
                    	if ($scope.onChange){
                    		eval($scope.onChange);
                    	}
                    },
                    onFinish:$scope.onFinish,
                    values: createValues()
                });
            })();
            $scope.$watch('min', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({min: value}); });
            },true);
            $scope.$watch('max', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({max: value}); });
            });
            // $scope.$watch('from', function(value) {
            //     $timeout(function(){ $element.data("ionRangeSlider").update({from: value}); });
            // });
            $scope.$watch('disable', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({disable: value}); });
            });
        }
    }
})

.directive('suGoogleMaps', function()
{
	function link(scope, element, attrs)
	{
		function loadMap()
		{
			lat = +attrs.lat;
			lng = +attrs.lng;
			zoom = +attrs.zoom;
			var mapOptions = {
				center: {lat: lat, lng: lng},
				zoom: zoom
			}

			var map = new google.maps.Map(element[0],mapOptions);
			function updateMap()
			{
				var marker = new google.maps.Marker({
					position: {lat: lat, lng: lng},
					map: map,
				});
				map.setCenter({lat: lat, lng: lng});
			}
			
			attrs.$observe('lat',function(value)
			{
				lat = +value;
				updateMap();
			});

			attrs.$observe('lng',function(value)
			{
				lng = +value;
				updateMap();
			});
		}
		try{
			if (google != undefined && google.maps != undefined)
			{
				loadMap();
			}
		}
		catch(e)
		{
			g_waiting_funcions.push(loadMap);
		}	


	}
	return {
		link: link
	};
})

.directive('suDayPicker', function(){
	var dayNames = [
		'\u0634\u0646\u0628\u0647',
		'\u06CC\u06A9\u0020\u0634\u0646\u0628\u0647',
		'\u062F\u0648\u0020\u0634\u0646\u0628\u0647',
		'\u0633\u0647\u0020\u0634\u0646\u0628\u0647',
		'\u0686\u0647\u0627\u0631\u0020\u0634\u0646\u0628\u0647',
		'\u067E\u0646\u062C\u0020\u0634\u0646\u0628\u0647',
		'\u062C\u0645\u0639\u0647'
	];
	return {
		templateUrl: 'templates/su-day-picker.html',
        // template: '<table class="su-day-picker-table" style="width: 100%"><tr><td ng-repeat="day in dayNames" su-id="{{$index}}" class="su-day-selected">{{day}}</td></tr></table>',
		scope: {
			pickedDays: '=pickedDays',

		},
		link: function(scope, element, attrs){
			scope.dayNames = dayNames;
			element.on('click', function(e){
				//console.log($(e.target).attr('su-id'));
				jQuery(e.target).toggleClass('su-day-selected');
				var days = element.children('table').children('tbody').children('tr').children('td');
				scope.pickedDays = [];
				for (var i = 0;i < days.length; i++){
					var currentElement = jQuery(days[i]);
					if (currentElement.hasClass('su-day-selected')){
						scope.pickedDays.push(i);
					}
				}
				scope.$apply();
				
			});
		}
	}
})

.directive('suDayShower', function(){
    var dayLetters = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

    return {
        templateUrl: 'templates/su-day-shower.html',
        scope: {selectedDays: '='},
        link: function(scope, element, attrs){
            scope.dayLetters = dayLetters;
        }
    };
})

.directive('knob', ['$timeout', function($timeout) {
    'use strict';

    function interpolateColor(val)
    {
    	var red = val > 50 ? Math.floor((val - 50) * 2 * 255 / 100) : 0;
    	var green = val < 50 ? Math.floor((50 - val) * 2 * 255 / 100) : 0;
    	var blue = 255 - red - green;
    	//var blue = Math.floor((100 - val) * 255 / 100);
    	//var red = 255 - blue;
    	var blueHex = Number(blue).toString(16);
    	var greenHex = Number(green).toString(16);
    	var redHex = Number(red).toString(16);
    	if (blueHex.length == 1)
    	{
    		blueHex = '0' + blueHex;
    	}
    	if (greenHex.length == 1)
    	{
    		greenHex = '0' + greenHex;
    	}
    	if (redHex.length == 1)
    	{
    		redHex = '0' + redHex;
    	}
    	return '#' + redHex + greenHex + blueHex;
    }



    return {
        restrict: 'EA',
        replace: true,
        template: '<input value="{{ knobData }}"/>',
        scope: {
            knobData: '=',
            knobOptions: '&'
        },
        link: function($scope, $element, attrs) {
            var knobInit = $scope.knobOptions() || {fgColor: '#000000',
             readOnly: true, format: function(val){
                return (+attrs.enrolled).toPersianString() + '/' + (+attrs.capacity).toPersianString();
             },
             draw: function(){
                jQuery('#capacity-left').css('font-size','20px');
             }
         };
            var elementId = attrs.id;

            knobInit.release = function(newValue) {
                $timeout(function() {
                    $scope.knobData = newValue;
                    console.log($scope.knobData);
                    $scope.$apply();
                });
            };

            $scope.$watch('knobData', function(newValue, oldValue) {
                if ((newValue != oldValue) || (newValue)) {
                	var newColor = interpolateColor(newValue);
                	$($element).val(newValue).change();
                	$($element).trigger('configure', {fgColor: newColor});
                	$($element).trigger('change');
                }
            });

            $($element).val($scope.knobData).knob(knobInit);
            
        }
    };
}]);


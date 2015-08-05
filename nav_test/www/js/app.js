var app = angular.module('ionicApp', ['ionic','ionicApp.controllers', 'ionicApp.directives']);

app.config(function($compileProvider)
	{
		//to prevent angular from adding :undafe prefix to :geo links
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|geo):/);
	});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider)
{
	$stateProvider

	.state('index',{
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html'
	})

	.state('index.places',{
		url: '/places',
		views:{
			main_content: {
				templateUrl: 'templates/places.html',
				controller: 'PlacesCtrl'
			}	
		}
		
	})

	.state('index.courses',{
		url: '/courses',
		views:{
			main_content: {
				templateUrl: 'templates/courses.html',
				controller: 'CoursesCtrl'
			}	
		}
		
	})

	.state('index.course',{
		url: '/course/:courseIndex',
		views:{
			main_content: {
				templateUrl: 'templates/course.html',
				controller: 'CourseCtrl'
			}	
		}
		
	})

	.state('index.place',{
		url: '/place/:placeId',
		views: {
			main_content: {
				templateUrl: 'templates/place.html',
				controller: 'PlaceCtrl'
			}
		}
	});
	// $locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('app/places');
});

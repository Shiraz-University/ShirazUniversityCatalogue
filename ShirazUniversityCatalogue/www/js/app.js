var app = angular.module('ionicApp', ['ionic','ionicApp.controllers', 'ionicApp.directives']);

app.config(function($compileProvider)
	{
		//to prevent angular from adding :undafe prefix to :geo links
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|geo|mailto):/);
	});

app.run(function($rootScope, $location){
	$rootScope.location = $location;
	$rootScope.showEducationMenu = false;
	$rootScope.toggleEdu = function($event){
		$rootScope.showEducationMenu = !$rootScope.showEducationMenu;
		$event.stopPropagation();
	}
	
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider)
{
	$stateProvider

	.state('index',{
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html'
	})

	.state('index.introduction',{
		url:'/introduction',
		views:{
			main_content:{
				templateUrl: 'templates/introduction.html',
				controller: 'introductionCtrl'
			}}
	})

	.state('index.construction',{
		url: '/construction',
		views:{
			main_content: {
				templateUrl: 'templates/construction.html',
				controller: 'constructionCtrl'
			}	
		}
		
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

	.state('index.forms',{
		url: '/forms',
		views:{
			main_content: {
				templateUrl: 'templates/forms.html',
				controller: 'FormsCtrl'
			}	
		}
		
	})


	.state('index.form',{
		url: '/form/:formId',
		views:{
			main_content: {
				templateUrl: 'templates/form.html',
				controller: 'FormCtrl'
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

	.state('index.person',{
		url: '/person/:departmentName/:sectionName/:personId',
		views:{
			main_content: {
				templateUrl: 'templates/person.html',
				controller: 'PersonCtrl'
			}	
		}
	})

	.state('index.persons',{
		url: '/persons',
		views:{
			main_content: {
				templateUrl: 'templates/persons.html',
				controller: 'PersonsCtrl'
			}	
		}
		
	})

	.state('index.departmentPersons',{
		url: '/persons/:departmentName',
		views:{
			main_content: {
				templateUrl: 'templates/persons.html',
				controller: 'DepartmentPersonsCtrl'
			}	
		}
		
	})

	.state('index.sectionPerson',{
		url: '/persons/:departmentName/:sectionName',
		views:{
			main_content: {
				templateUrl: 'templates/departmentPersons.html',
				controller: 'SectionPersonsCtrl'
			}	
		}
	})

	

	

	

	.state('index.search',{
		url: '/search',
		views:{
			main_content: {
				templateUrl: 'templates/search.html',
				controller: 'searchCtrl'
			}	
		}
		
	})

	.state('index.Education',{
		url: '/Education',
		views:{
			main_content: {
				templateUrl: 'templates/Education.html',
				controller: 'educationCtrl'
			}	
		}
	})

	.state('index.signup',{
		url: '/signup',
		views:{
			main_content: {
				templateUrl: 'templates/signup.html',
				controller: 'SignupCtrl'
			}	
		}
	})

	.state('index.faq',{
		url: '/signup/faq',
		views:{
			main_content: {
				templateUrl: 'templates/signup-faq.html',
			}	
		}
	})

	.state('index.content', {
		url: '/content/*path',
		views:{
			main_content: {
				templateUrl: 'templates/content.html',
				controller: 'ContentCtrl'
			}
		}
	})	

	.state('index.departmentCourses', {
		url: '/courses/:departmentName',
		views:{
			main_content: {
				templateUrl: 'templates/department-courses.html',
				controller: 'DepartmentCoursesCtrl'
			}
		}
	})

	.state('index.course',{
		url: '/course/:departmentName/:courseIndex',
		views:{
			main_content: {
				templateUrl: 'templates/course.html',
				controller: 'CourseCtrl'
			}	
		}
		
	})

	.state('index.external_place',{
		url: '/external-place/:placeId',
		views: {
			main_content: {
				templateUrl: 'templates/external-place.html',
				controller: 'ExternalPlaceCtrl'
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
	$urlRouterProvider.otherwise('app/introduction');
});

angular.module('ionicApp.controllers', ['ngRoute'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.run(function($rootScope)
{
    $rootScope.getPlaceWithId = function(places,iden){
        return places.filter(function(x){return x.id == iden})[0];
    }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.factory('PlaceFactory', function($http, $cacheFactory)
{
    get_url = '../json/places.json';

    // if (ionic.Platform.isAndroid())
    // {
    //     get_url = '/android_asset/www/json/places.json';
    // }
    
    return $http.get(get_url,{ cache: true});

})

.factory('CourseFactory', function($http, $cacheFactory)
{
    get_url = '../json/courses.json';

    // if (ionic.Platform.isAndroid())
    // {
    //     get_url = '/android_asset/www/json/places.json';
    // }
    
    return $http.get(get_url,{ cache: true});

})

.controller('PlacesCtrl', function($scope, PlaceFactory)
{
    
    PlaceFactory.success(function(data)
    {
        $scope.places = data;
    })
    // $http.get('../json/places.json').success(function(resp)
    // {
    //     $scope.places = resp;
    // });
})

.filter('inRange', function(){
    function parseTime(timeString){
        var parts = timeString.split(':');
        var hour = +parts[0];
        var minute = +parts[1];
        var totalMinute = hour * 60 + minute;
        return totalMinute;
    }
    function getSessionTimes(course){
        var hours = course.hours;
        var sessions = hours.split('?');
        var sessionInstances = [];
        for (var i = 0; i < sessions.length; i++){
            var currentSession = sessions[i];
            var parts = currentSession.split('!');
            var day = parts[0];
            var start = parts[1];
            var end = parts[2];
            // console.log(parseTime(start));
            // console.log(parseTime(end));
            sessionInstances.push({day: day, start: parseTime(start), end: parseTime(end)});
        }
        return sessionInstances;
    }

    function isSessionInTime(session, timeRange){
        if ((session.start >= timeRange.from) && (session.end <= timeRange.to)){
            return true;
        }
        return false;
    }

    function isInTimeRange(course, timeRange){
        if (!timeRange){
            return true;
        }
        var startTime = 7 * 60 + 30 + timeRange.from * 15;
        var endTime = 7 * 60 + 30 + timeRange.to * 15;
        var sessions = getSessionTimes(course);
        for (var i = 0; i < sessions.length; i++){
            var currentSession = sessions[i];
            if (!isSessionInTime(currentSession, {from: startTime, to: endTime})){
                return false;
            }
        }
        return true;
    }

    function getTimeRangeFilter(timeRange){
        return function(course){
            return isInTimeRange(course, timeRange);
        }
    }

    return function(items, timeRange){
        var filteredItems = [];
        var timeRangeFilter = getTimeRangeFilter(timeRange);
        angular.forEach(items, function(item){
            if (timeRangeFilter(item)){
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
})

.controller('CoursesCtrl', function($scope, CourseFactory)
{
    CourseFactory.success(function(data){
        $scope.courses = data;
        $scope.timeFilterModel = {from : 0, to: 50};
        var timeFilterFrom = 0;
        var timeFilterTo = 0;
        $scope.$watch('timeFilterModel.start', function(val){
            timeFilterTo = 7 * 60 + 30 + val * 15;
        });
        $scope.$watch('timeFilterModel.end', function(val){
            timeFilterFrom = 7 * 60 + 30 + val * 15;
        });

        
    });
})

.controller('CourseCtrl', function($scope,$stateParams ,CourseFactory)
{
    var courseIndex = $stateParams.courseIndex;
    CourseFactory.success(function(data){
        $scope.courses = data;
        var course = $scope.courses[courseIndex];
        $scope.course = course;
        var knobValue = course.capacity > 0 ? 100 * course.enrolled_num / course.capacity : 100;
        var displayString = course.enrolled_num.toString() + '/' + course.capacity.toString();
        $scope.knobValue = knobValue;
        $scope.displayString = displayString;

    });


})

.controller('PlaceCtrl', function($rootScope,$scope, $stateParams, PlaceFactory)
{
    var placeId = $stateParams.placeId;
    var allPlaces = null;
    var places = PlaceFactory.success(function(data){
        $scope.place = $rootScope.getPlaceWithId(data,$stateParams.placeId);
        allPlaces = data;
        $scope.descUrl = '../places/' + $scope.place.id + '/desc.html';
    });



    $scope.getSubPlaces = function()
    {
        var subPlaces = [];
        // for (var x in $scope.place.subPlaces)
        // {
        //     var index = $scope.place.subPlaces[x];
        //     var subPlace = allPlaces[index];
        //     subPlaces.push(subPlace);
        // }
        for (var placeIndex in allPlaces)
        {
            if (allPlaces[placeIndex].parent == $scope.place.id)
            {
                subPlaces.push(allPlaces[placeIndex]);
            }
        }
        return subPlaces;
    }

    $scope.openMaps = function()
    {
        launchnavigator.navigate([29.6305101,52.5215712]);
    }

    $scope.dbClick = function($event)
    {
        console.log($event.target.getAttribute('href'));
    }

    $scope.dbClick2 = function($event)
    {
        console.log("called!");
        window.open('http://www.google.com', '_blank','location=yes');
    }

    $scope.openLink = function($event)
    {
        var url = $event.currentTarget.getAttribute('href');
        window.open(url, '_system','location=yes');      
    }
    $scope.isMapsLoaded = false;
    try{
        $scope.isMapsLoaded = (google != undefined)
         && (google.maps != undefined)
         && (google.maps.Map != undefined);
    }
    catch(e)
    {

    }

    try{

        $scope.isOffline = navigator.connection.type == Connection.NONE;
    }
    catch(e)
    {
        $scope.isOffline = false;
    }

    
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

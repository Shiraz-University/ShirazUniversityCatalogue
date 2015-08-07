
Number.prototype.toPersianString = function(){
    var persianDigits = '۰۱۲۳۴۵۶۷۸۹'
    var res = '';
    var englishString = this.toString();
    if (englishString[0] == '-'){
        res += '-';
        englishString = englishString.slice(1,englishString.length);
    }
    for (var i = 0;i< englishString.length; i++){
        var digitNum = +englishString[i];
        var translatedDigit = persianDigits[digitNum];
        res += translatedDigit;
    }
    return res;
};
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

.controller('FormsCtrl', function($scope, FormFactory){
    FormFactory.then(function(data){
        console.log(data);
        $scope.forms = data;
    });
})

.controller('FormCtrl', function($scope,$stateParams, FormFactory){
    var formId = $stateParams.formId;
    FormFactory.then(function(data){
        var allForms = data;
        var currentForm = data.filter(function(x){return x.id == formId;})[0];
        $scope.form = currentForm;
    });
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

.factory('FormFactory', function($http, $cacheFactory)
{
    get_url = '../json/forms.json';
    // if (ionic.Platform.isAndroid())
    // {
    //     get_url = '/android_asset/www/json/forms.json';
    // }
    return $http.get(get_url,{ cache: true}).then(function(items){
        var returnedItems = [];
        for (var i = 0; i< items.data.length; i++){
            items.data[i].id = i;
            if (items.data[i].title){
                returnedItems.push(items.data[i]);
            }
        }
        return returnedItems;
    });

})

.factory('CourseFactory', function($http, $cacheFactory)
{
    get_url = '../json/courses.json';

    // if (ionic.Platform.isAndroid())
    // {
    //     get_url = '/android_asset/www/json/courses.json';
    // }
    function parseTime(timeString){
        var parts = timeString.split(':');
        var hour = +parts[0];
        var minute = +parts[1];
        var totalMinute = hour * 60 + minute;
        return totalMinute;
    }
    function reverseParseTime(time){
        var hour = Math.floor(time / 60);
        var minute = time % 60;
        var hourString  = hour.toPersianString();
        var minuteString = minute.toPersianString();
        if (minuteString.length == 1) minuteString = '0' + minuteString;
        if (hourString.length == 1) hourString = '0' + hourString;
        return {hour: hour, minute: minute, showString: hourString + ':' + minuteString};
    }
    function getSessionTimes(course){
        var hours = course.hours;
        var sessions = hours.split('?');
        var sessionInstances = [];
        var dayTranslationTable = {
            'شنبه' : 0,
            'يک شنبه' : 1,
            'دو شنبه' : 2,
            'سه شنبه' : 3,
            'چهار شنبه' : 4,
            'پنج شنبه' : 5,
            'جمعه' : 6,
        };
        function dayTranslate(dayname){
            if (dayname in dayTranslationTable){
                return dayTranslationTable[dayname];
            }
            //todo: remove in production
            else{
                console.log('the dayname was : ');
                console.log(dayname);
                console.log('تست');
                throw "test";
            }

        }
        for (var i = 0; i < sessions.length; i++){
            var currentSession = sessions[i];
            var parts = currentSession.split('!');
            var day = parts[0];
            var start = parts[1];
            var end = parts[2];
            // console.log(parseTime(start));
            // console.log(parseTime(end));
            sessionInstances.push({day: dayTranslate(day), start: parseTime(start), end: parseTime(end)});
        }
        return sessionInstances;
    }

    function getDays(course){
        var days = [];
        for (var i = 0;i< course.sessions.length; i++){
            var session = course.sessions[i];
            days.push(session.day);
        }
        return days;
    }

    function getTimes(course){
        var sessions = [course.sessions[0]];
        for (var i = 1;i<course.sessions.length;i++){
            var session = course.sessions[i];
            if (!(session.start == sessions[0].start && session.end == sessions[0].end)){
                sessions.push(session);
            }
        }
        var times = [];
        for (var i = 0;i < sessions.length; i++){
            var session = sessions[i];
            times.push({start: reverseParseTime(session.start),
             end: reverseParseTime(session.end)});
        }
        return times;
    }

    return $http.get(get_url,{ cache: true}).then(function(response){
        for (var i = 0; i< response.data.length; i++)
        {
            var currentCourse = response.data[i];
            currentCourse.id = i;
            var sessionTimes = getSessionTimes(currentCourse);
            currentCourse.sessions = sessionTimes;
            currentCourse.days = getDays(currentCourse);
            currentCourse.times = getTimes(currentCourse);
        }
        return response.data;
    });
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
        var sessions = course.sessions;
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

.filter('inDays', function(){

    function isCourseInDays(course, days){
        for (var i = 0; i< course.sessions.length; i++){
            var session = course.sessions[i];
            if (days.indexOf(session.day) == -1){
                return false;
            }
        }
        return true;
    }

    return function(items, days){
        var filteredItems = [];
        angular.forEach(items, function(course){
            if (isCourseInDays(course, days)){
                filteredItems.push(course);
            }
        });
        return filteredItems;
    }
})

.controller('CoursesCtrl', function($scope, CourseFactory)
{
    CourseFactory.then(function(data){
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

        $scope.daysToFilter = [0,1,2,3,4,5,6];

    });
})

.controller('CourseCtrl', function($scope,$stateParams ,CourseFactory)
{
    var courseIndex = $stateParams.courseIndex;
    function findCourseWithId(courses,id){
        for (var i = 0;i < courses.length; i++)
        {
            var course = courses[i];
            if (course.id == id) {
                return course;
            }
        }
    }
    CourseFactory.then(function(data){
        $scope.courses = data;
        // var course = $scope.courses[courseIndex];
        var course = findCourseWithId(data,courseIndex);
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

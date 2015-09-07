Number.prototype.toPersianString = function () {
    var persianDigits = '۰۱۲۳۴۵۶۷۸۹'
    var res = '';
    var englishString = this.toString();
    if (englishString[0] == '-') {
        res += '-';
        englishString = englishString.slice(1, englishString.length);
    }
    for (var i = 0; i < englishString.length; i++) {
        var digitNum = +englishString[i];
        var translatedDigit = persianDigits[digitNum];
        res += translatedDigit;
    }
    return res;
};

Array.prototype.groupBy = function (groupFn) {
    var res = {};
    this.forEach(function (elem) {
        var groupToken = groupFn(elem);
        if (res[groupToken] == undefined) {
            res[groupToken] = [elem];
        }
        else {
            res[groupToken].push(elem);
        }
    });
    return res;
}

function getKeys(obj) {
    var res = [];
    for (var x in obj) {
        res.push(x);
    }
    return res;
}

angular.module('ionicApp.controllers', ['ngRoute'])

    .controller('DashCtrl', function ($scope) {
    })
    .controller('searchCtrl', function () {

    })

    .controller('educationCtrl', function () {

    })
    .controller('introductionCtrl', function () {

    })
    .controller('constructionCtrl', function () {

    })

    .controller('SignupCtrl', function () {

    })

    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .run(function ($rootScope) {
        $rootScope.getPlaceWithId = function (places, iden) {
            return places.filter(function (x) {
                return x.id == iden
            })[0];
        }

        $rootScope.openLink = function ($event) {
            var url = $event.currentTarget.getAttribute('href');
            window.open(url, '_system', 'location=yes');
        }
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('FormsCtrl', function ($scope, FormFactory) {
        FormFactory.then(function (data) {
            $scope.forms = data;
        });
    })

    .controller('PersonsCtrl', function ($scope, $stateParams, PersonFactory) {

        PersonFactory.then(function (data) {
            $scope.departments = getKeys(data);
        });
    })

    .controller('SectionPersonsCtrl', function ($scope, $stateParams, PersonFactory) {

        PersonFactory.then(function (data) {
            var departmentName = $stateParams['departmentName'];
            var sectionName = $stateParams['sectionName'];
            $scope.department = departmentName;
            $scope.section = sectionName;
            data = data[departmentName][sectionName];

            $scope.persons = data;
        });
    })

    .controller('DepartmentPersonsCtrl', function ($scope, $stateParams, PersonFactory) {
        var departmentName = $stateParams.departmentName;
        $scope.department = departmentName;
        PersonFactory.then(function (data) {
            $scope.departments = getKeys(data[departmentName]);
            $scope.department = departmentName;
        });
    })

    .controller('FormCtrl', function ($scope, $stateParams, FormFactory) {
        var formId = $stateParams.formId;
        FormFactory.then(function (data) {
            var allForms = data;
            var currentForm = data.filter(function (x) {
                return x.id == formId;
            })[0];
            $scope.form = currentForm;
        });
    })

    .controller('PersonCtrl', function ($scope, $stateParams, PersonFactory) {
        var personId = $stateParams.personId;
        var departmentName = $stateParams.departmentName;
        var sectionName = $stateParams.sectionName;
        $scope.department = departmentName;
        $scope.section = sectionName;
        PersonFactory.then(function (data) {
            var currentForm = data[departmentName][sectionName].filter(function (x) {
                return x.id == personId;
            })[0];
            $scope.person = currentForm;
        });
    })

    .factory('PlaceFactory', function ($http, $cacheFactory, ExtraPlaceFactory) {
        get_url = '../json/places.json';

        if (ionic.Platform.isAndroid()) {
            get_url = '/android_asset/www/json/places.json';
        }
        return $http.get(get_url, {cache: true}).then(function (resp) {
            var data = resp.data;
            var returnedData = [];
            return ExtraPlaceFactory.then(function (extraPlaces) {
                extraPlaces = extraPlaces.allExtraPlaces;
                for (placeType in data) {
                    var placesInType = data[placeType];
                    for (var i = 0; i < placesInType.length; i++) {
                        var currentPlace = placesInType[i];
                        currentPlace['nearbyPlaces'] = [];
                        currentPlace['placeType'] = placeType;
                        returnedData.push(currentPlace);

                        for (var j = 0; j < extraPlaces.length; j++) {
                            var currentExtraPlace = extraPlaces[j];
                            for (var k = 0; k < currentExtraPlace.nearby_places.length; k++) {
                                var currentNearbyPlace = currentExtraPlace.nearby_places[k];
                                if (currentPlace.id == currentNearbyPlace) {
                                    currentPlace.nearbyPlaces.push(currentExtraPlace);
                                    break;
                                }
                            }
                        }
                    }
                }
                return {allPlaces: returnedData, categorizedPlaces: resp.data};
            });

            //return {allPlaces: returnedData, categorizedPlaces: resp.data};
        });

    })

    .factory('ExtraPlaceFactory', function ($http) {
        get_url = '../json/extra_places.json';
        if (ionic.Platform.isAndroid()) {
            get_url = '/android_asset/www/json/extra_places.json';
        }

        var allExtraPlaces = [];
        var allPlaceTypes = [];
        return $http.get(get_url, {cache: true}).then(function (resp) {
            for (var placeType in resp.data) {
                allPlaceTypes.push(placeType);
                var thisTypePlaces = resp.data[placeType];
                angular.forEach(thisTypePlaces, function (place) {
                    place.placeType = placeType;
                    allExtraPlaces.push(place);
                })
            }
            allPlaceTypes.sort();
            return {allExtraPlaces: allExtraPlaces, allExtraPlaceTypes: allPlaceTypes};
        });
    })

    .factory('FormFactory', function ($http, $cacheFactory) {
        get_url = '../json/forms.json';
        if (ionic.Platform.isAndroid()) {
            get_url = '/android_asset/www/json/forms.json';
        }
        return $http.get(get_url, {cache: true}).then(function (items) {
            var returnedItems = [];
            for (var i = 0; i < items.data.length; i++) {
                items.data[i].id = i;
                if (items.data[i].title) {
                    returnedItems.push(items.data[i]);
                }
            }
            return returnedItems;
        });

    })

    .factory('PersonFactory', function ($http, $cacheFactory) {
        get_url = '../json/Persons.json';
        if (ionic.Platform.isAndroid()) {
            get_url = '/android_asset/www/json/Persons.json';
        }
        return $http.get(get_url, {cache: true}).then(function (items) {
            var returnedItems = [];
            for (var i = 0; i < items.data.length; i++) {
                items.data[i].id = i;
                returnedItems.push(items.data[i]);
            }
            var groupByDaneshkade = returnedItems.groupBy(function (person) {
                return person.daneshkade;
            });
            var res = {};

            for (var key in groupByDaneshkade) {
                var personsInThisDaneshkade = groupByDaneshkade[key];
                var groupByBakhsh = personsInThisDaneshkade.groupBy(function (person) {
                    return person.bakhsh;
                });
                res[key] = groupByBakhsh;
            }
            return res;
        });
    })

    .factory('ContentFactory', function ($http, $cacheFactory) {
        get_url = '../json/contents.json';
        if (ionic.Platform.isAndroid()) {
            get_url = '/android_asset/www/json/contents.json';
        }
        return $http.get(get_url, {cache: true}).then(function (items) {

            return items.data;
        });

    })

    .factory('CourseFactory', function ($http, $cacheFactory) {
        get_url = '../json/courses.json';

        var dayTranslationTable = {
            'شنبه': 0,
            'يک شنبه': 1,
            'دو شنبه': 2,
            'سه شنبه': 3,
            'چهار شنبه': 4,
            'پنج شنبه': 5,
            'جمعه': 6,
        };
        var reverseDayTranslationTable = (function (table) {
            var res = {};
            for (var name in table) {
                res[table[name]] = name;
            }
            return res;
        })(dayTranslationTable);

        if (ionic.Platform.isAndroid()) {
            get_url = '/android_asset/www/json/courses.json';
        }
        function parseTime(timeString) {
            var parts = timeString.split(':');
            var hour = +parts[0];
            var minute = +parts[1];
            var totalMinute = hour * 60 + minute;
            return totalMinute;
        }

        function reverseParseTime(time) {
            var hour = Math.floor(time / 60);
            var minute = time % 60;
            var hourString = hour.toPersianString();
            var minuteString = minute.toPersianString();
            if (minuteString.length == 1) minuteString = '۰' + minuteString;
            if (hourString.length == 1) hourString = '۰' + hourString;
            return {hour: hour, minute: minute, showString: hourString + ':' + minuteString};
        }

        function getSessionTimes(course) {
            var hours = course.hours;
            var sessions = hours.split('?');
            var sessionInstances = [];

            function dayTranslate(dayname) {
                if (dayname in dayTranslationTable) {
                    return dayTranslationTable[dayname];
                }
                else {
                    throw "invalid day name: " + dayname;
                }
            }

            for (var i = 0; i < sessions.length; i++) {
                var currentSession = sessions[i];
                var parts = currentSession.split('!');
                var day = parts[0];
                var start = parts[1];
                var end = parts[2];
                sessionInstances.push({
                    day: dayTranslate(day),
                    dayName: day,
                    start: parseTime(start),
                    end: parseTime(end),
                    showString: day + ' ' + reverseParseTime(parseTime(start)).showString + ' ' + reverseParseTime(parseTime(end)).showString
                });
            }
            return sessionInstances;
        }

        function getDays(course) {
            var days = [];
            for (var i = 0; i < course.sessions.length; i++) {
                var session = course.sessions[i];
                days.push(session.day);
            }
            return days;
        }

        function getTimes(course) {
            var sessions = [course.sessions[0]];
            for (var i = 1; i < course.sessions.length; i++) {
                var session = course.sessions[i];
                if (!(session.start == sessions[0].start && session.end == sessions[0].end)) {
                    sessions.push(session);
                }
            }
            var times = [];
            for (var i = 0; i < sessions.length; i++) {
                var session = sessions[i];
                times.push({
                    start: reverseParseTime(session.start),
                    end: reverseParseTime(session.end)
                });
            }
            return times;
        }


        function groupCourseSessionsByTime(course) {
            var sessionTimes = {};
            var sessions = course.sessions;

            angular.forEach(sessions, function (session) {
                if (sessionTimes[[session.start, session.end]] == undefined) {
                    sessionTimes[[session.start, session.end]] = [session];
                }
                else {
                    sessionTimes[[session.start, session.end]].push(session);
                }
            });
            return sessionTimes;
        }

        function getFullSessionDayTimeString(course) {
            var groups = groupCourseSessionsByTime(course);
            var res = '';
            for (var sessionTime in groups) {
                sessionTimeSplit = sessionTime.split(',');
                sessionTime = [+sessionTimeSplit[0], +sessionTimeSplit[1]]
                var sessionsInCurrentSessionTime = groups[sessionTime];

                angular.forEach(sessionsInCurrentSessionTime, function (session, index, array) {
                    var length = array.length;
                    res += reverseDayTranslationTable[session.day] + ' ها ' + (index < (length - 1) ? 'و ' : '');
                });
                res += ' از' + reverseParseTime(sessionTime[0]).showString + ' تا ' + reverseParseTime(sessionTime[1]).showString + ' - ';
            }
            return res.substring(0, res.length - 3);
        }


        return $http.get(get_url, {cache: true}).then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                var currentDepartment = response.data[j];
                var acceptedCourses = [];
                for (var i = 0; i < currentDepartment.courses.length; i++) {
                    var currentCourse = currentDepartment.courses[i];
                    currentCourse.id = i;
                    try {
                        var sessionTimes = getSessionTimes(currentCourse);
                        currentCourse.sessions = sessionTimes;
                        currentCourse.days = getDays(currentCourse);
                        currentCourse.times = getTimes(currentCourse);
                        var allowedFieldsString = currentCourse.allowed_fields;
                        var allowedFields = allowedFieldsString.split('*').filter(function (x) {
                            return x
                        });
                        currentCourse.allowed_fields = allowedFields;
                        currentCourse.fullSessionTimeString = getFullSessionDayTimeString(currentCourse);
                        acceptedCourses.push(currentCourse);
                    }
                    catch (e) {
                        console.log('there was an error in the following course:');
                        console.log(currentCourse);
                    }
                }
                currentDepartment.courses = acceptedCourses;
            }
            return response.data;
        });
    })


    .controller('PlacesCtrl', function ($scope, PlaceFactory) {
        var placeTypeTranslations = {
            'Buildings': 'ساختمان ها',
            'Rooms': 'اتاق ها',
            'Departments': 'دپارتمان ها'
        };
        PlaceFactory.then(function (data) {
            $scope.places = data.allPlaces;
            $scope.placeTypes = (function (objs) {
                var res = [];
                for (var i = 0; i < objs.length; i++) {
                    res.push({
                        english: objs[i],
                        persian: placeTypeTranslations[objs[i]]
                    });
                }
                return res;
            })(Object.keys(data.categorizedPlaces));

        })
        // $http.get('../json/places.json').success(function(resp)
        // {
        //     $scope.places = resp;
        // });
    })

    .controller('ContentCtrl', function ($scope, $stateParams, ContentFactory) {
        var pathDelim = '/';
        var pathParts = $stateParams.path.split(pathDelim);

        function findChild(children, name) {
            return children.filter(function (ch) {
                return ch.name == name;
            })[0];
        }

        function findRootContent(contentData, path) {
            var currentRoot = contentData;
            for (var i = 1; i < path.length; i++) {
                var currentElem = path[i];
                var currentRoot = findChild(currentRoot.children, currentElem);
            }
            return currentRoot;
        }

        ContentFactory.then(function (data) {
            $scope.contents = findRootContent(data, pathParts);
            $scope.folders = $scope.contents.children.filter(function (elem) {
                return elem.type == 'folder';
            });
            $scope.docs = $scope.contents.children.filter(function (elem) {
                return elem.type == 'content';
            });
            console.log($scope.contents);
        })
    })

    .filter('persianCompare', function () {
        return function (items, string) {
            string = string || '';
            var res = [];
            var changedString = string.
                replace(RegExp('ی', 'g'), "\u064a").replace(RegExp('ک', 'g'), "\u0645");
            angular.forEach(items, function (item) {
                if (typeof item == 'string') {
                    if ((item.indexOf(string) > -1)
                        || (item.indexOf(changedString) > -1)) {
                        res.push(item);
                    }
                }
                else {
                    for (var key in item) {
                        var currentElem = String(item[key]);
                        if ((currentElem.indexOf(string) > -1) ||
                            (currentElem.indexOf(changedString) > -1)) {
                            res.push(item);
                            break;
                        }
                    }
                }
            });
            return res;
        };
    })

    .filter('inRange', function () {


        function isSessionInTime(session, timeRange) {
            if ((session.start >= timeRange.from) && (session.end <= timeRange.to)) {
                return true;
            }
            return false;
        }

        function isInTimeRange(course, timeRange) {
            if (!timeRange) {
                return true;
            }
            var startTime = 7 * 60 + 30 + timeRange.from * 15;
            var endTime = 7 * 60 + 30 + timeRange.to * 15;
            var sessions = course.sessions;
            for (var i = 0; i < sessions.length; i++) {
                var currentSession = sessions[i];
                if (!isSessionInTime(currentSession, {from: startTime, to: endTime})) {
                    return false;
                }
            }
            return true;
        }

        function getTimeRangeFilter(timeRange) {
            return function (course) {
                return isInTimeRange(course, timeRange);
            }
        }

        return function (items, timeRange) {
            var filteredItems = [];
            var timeRangeFilter = getTimeRangeFilter(timeRange);
            angular.forEach(items, function (item) {
                if (timeRangeFilter(item)) {
                    filteredItems.push(item);
                }
            });
            return filteredItems;
        }
    })

    .filter('inDays', function () {

        function isCourseInDays(course, days) {
            for (var i = 0; i < course.sessions.length; i++) {
                var session = course.sessions[i];
                if (days.indexOf(session.day) == -1) {
                    return false;
                }
            }
            return true;
        }

        return function (items, days) {
            var filteredItems = [];
            angular.forEach(items, function (course) {
                if (isCourseInDays(course, days)) {
                    filteredItems.push(course);
                }
            });
            return filteredItems;
        }
    })

    .filter('extraPlaceType', function () {
        return function (items, placeType) {
            return items.filter(function (item) {
                return item.placeType == placeType;
            });
        }
    })

    .controller('CoursesCtrl', function ($scope, CourseFactory) {
        CourseFactory.then(function (data) {
            $scope.departmentCourses = data;
        });
    })

    .controller('DepartmentCoursesCtrl', function ($scope, $stateParams, CourseFactory) {
        $scope.department = $stateParams.departmentName;
        function findDepartmentCourses(departmentCourses, departmentName) {
            for (var i = 0; i < departmentCourses.length; i++) {
                if (departmentCourses[i].name == departmentName) {
                    return departmentCourses[i];
                }
            }
        }

        CourseFactory.then(function (data) {
            $scope.courses = findDepartmentCourses(data, $stateParams.departmentName).courses;

            $scope.timeFilterModel = {from: 0, to: 50};
            var timeFilterFrom = 0;
            var timeFilterTo = 0;
            $scope.$watch('timeFilterModel.start', function (val) {
                timeFilterTo = 7 * 60 + 30 + val * 15;
            });
            $scope.$watch('timeFilterModel.end', function (val) {
                timeFilterFrom = 7 * 60 + 30 + val * 15;
            });

            $scope.daysToFilter = [0, 1, 2, 3, 4, 5, 6];
        })
    })

    .controller('CourseCtrl', function ($scope, $stateParams, CourseFactory) {
        var courseIndex = $stateParams.courseIndex;
        var departmentName = $stateParams.departmentName;

        function findCourseWithIdAndDepartment(departmentCourses, id, departmentName) {
            for (var i = 0; i < departmentCourses.length; i++) {
                var currentDepartment = departmentCourses[i];
                if (currentDepartment.name == departmentName) {
                    for (var j = 0; j < currentDepartment.courses.length; j++) {
                        var currentCourse = currentDepartment.courses[j];
                        if (currentCourse.id == id) {
                            return currentCourse;
                        }
                    }
                }
            }
        }

        CourseFactory.then(function (data) {
            $scope.courses = data;
            // var course = $scope.courses[courseIndex];
            var course = findCourseWithIdAndDepartment(data, courseIndex, departmentName);
            $scope.course = course;
            var knobValue = course.capacity > 0 ? 100 * course.enrolled_num / course.capacity : 100;
            var displayString = course.enrolled_num.toString() + '/' + course.capacity.toString();
            $scope.knobValue = knobValue;
            $scope.displayString = displayString;

        });


    })

    .controller('ExternalPlaceCtrl', function ($scope, $stateParams, ExtraPlaceFactory) {
        var placeId = $stateParams.placeId;
        var allPlaces = null;
        var allExternalPlaces = ExtraPlaceFactory.then(function (data) {
            allPlaces = data.allExtraPlaces;
            angular.forEach(allPlaces, function (place) {
                if (place.id == placeId) {
                    $scope.place = place;
                }
            })
        })
    })

    .controller('PlaceCtrl', function ($rootScope, $scope, $stateParams, PlaceFactory, ExtraPlaceFactory) {

        var placeId = $stateParams.placeId;
        var allPlaces = null;
        var places = PlaceFactory.then(function (data) {
            $scope.place = $rootScope.getPlaceWithId(data.allPlaces, $stateParams.placeId);
            allPlaces = data.allPlaces;
            //$scope.descUrl = 'places/' + $scope.place.id + '/desc.html';
            $scope.descUrl = 'place_templates/' + $scope.place.id + '.html';
        });

        ExtraPlaceFactory.then(function (resp) {
            $scope.allExtraPlaceTypes = resp.allExtraPlaceTypes;
            $scope.external_place_type_input = resp.allExtraPlaceTypes[0];
        });

        $scope.translatePlaceType = function (placeType) {
            console.log(placeType);
            var translationTable = {
                'bank': 'بانک',
                'bookstore': 'کتاب فروشی',
                'food': 'غذا',
                'hospital': 'بیمارستان',
                'library': 'کتابخانه',
                'movie_theater': 'سینما',
                'meal_delivery': 'غذای بیرون بر',
                'parking': 'پارکینگ'
            }

            return translationTable[placeType];
        }


        $scope.getSubPlaces = function () {
            var subPlaces = [];
            // for (var x in $scope.place.subPlaces)
            // {
            //     var index = $scope.place.subPlaces[x];
            //     var subPlace = allPlaces[index];
            //     subPlaces.push(subPlace);
            // }
            for (var placeIndex in allPlaces) {
                if (allPlaces[placeIndex].parent == $scope.place.id) {
                    subPlaces.push(allPlaces[placeIndex]);
                }
            }
            return subPlaces;
        }

        $scope.openMaps = function () {
            launchnavigator.navigate([29.6305101, 52.5215712]);
        }

        $scope.dbClick = function ($event) {
        }

        $scope.dbClick2 = function ($event) {
            window.open('http://www.google.com', '_blank', 'location=yes');
        }


        $scope.isMapsLoaded = false;
        try {
            $scope.isMapsLoaded = (google != undefined)
                && (google.maps != undefined)
                && (google.maps.Map != undefined);
        }
        catch (e) {

        }

        try {

            $scope.isOffline = navigator.connection.type == Connection.NONE;
        }
        catch (e) {
            $scope.isOffline = false;
        }


    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })


    .controller('MenuController', function ($scope) {
        $scope.groups = [
            {name: 'دانشگاه شیراز', href:'#/app/introduction'},
            {
                name: 'آموزشی',
                items : [
                    {name: 'راهنما', href: '#/app/content//%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C'},
                    {name: 'افراد', href: '#/app/persons'}
                ]
            },
            {name: 'سکونت', href:'#/app/content//%D8%B3%DA%A9%D9%88%D9%86%D8%AA'},
            {name: 'تغذیه', href:'#/app/content//%D8%AA%D8%BA%D8%B0%DB%8C%D9%87'},
            {name: 'حمل و نقل', href:'#/app/content//%D8%AD%D9%85%D9%84%20%D9%88%20%D9%86%D9%82%D9%84'},
            {name: 'مکان ها', href:'#/app/places'},
            {name: 'فرم ها', href:'#/app/forms'},
            
        ];

        $scope.toggleGroup = function (group) {
            group.show = !group.show;
        };
        $scope.isGroupShown = function (group) {
            return group.show;
        };

    });


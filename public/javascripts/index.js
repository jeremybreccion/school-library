var app  = angular.module('UserApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('register', {
        url: '/register',
        templateUrl: 'register.html',
        controller: 'RegisterController'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginController'
    })
    .state('main', {
        templateUrl: 'main.html',
        controller: 'MainController'
    })
    .state('home', {
        parent: 'main',
        url: '/',
        templateUrl: 'main/home.html',
        controller: 'HomeController'
    })
    .state('settings', {
        parent: 'main',
        url: '/settings',
        templateUrl: 'main/settings.html',
        controller: 'SettingsController'
    })
    .state('student', {
        parent: 'main',
        url: '/student',
        templateUrl: 'main/student.html',
        //controller: 'StudentController'
    })
    .state('admin', {
        parent: 'main',
        url: '/admin',
        templateUrl: 'main/admin.html',
        controller: 'AdminController'
    });

    //401 == unauthorized http request. refer to app.js
    $httpProvider.interceptors.push(function($q, $window, $location, $rootScope, ModalService){
        return {
            'responseError': function(rejection){
                var defer = $q.defer();
                if(rejection.status == 401){
                    alert('Unauthorized http request');
                    $rootScope.current_user = {};
                    $rootScope.token = undefined;
                    ModalService.hide();
                    $window.location.href = '/#/home';
                }
                defer.reject(rejection);
                return defer.promise;
            }
        }
    });
});

app.run(function($rootScope, $state, $http, $window){
    $rootScope.current_user = {}; 
    $rootScope.languages = {};

    //get english & nihongo languages from server and set to rootScope
    $http.get('/languages/getLanguages').then(function(res){
        ////console.log('getting languages...');
        $rootScope.languages = res.data.languages;
        //console.log($rootScope.languages);
    });

    //run once? OR RUN EVERY STATECHANGE TO DETERMINE IF SERVER RESTARTS?
    //need this here for enabling multiple tabs since each tab will @ first load will run this
    //disadvantage: double codes, double execution ??
    ////console.log('getting token...');
    $http.get('/session').then(function(res){
        ////console.log(res);
        $rootScope.token = res.data.token;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
        $rootScope.current_user = res.data.user;
        //$state.transitionTo('home');
    }).catch(function(err){
        $rootScope.current_user = {};
        $rootScope.token = undefined;
        //$state.transitionTo('login');
    });
    
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        //console.log('getting token...');
        $http.get('/session').then(function(res){
            ////console.log(res);
            //console.log(res.data);
            $rootScope.token = res.data.token;
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
            $rootScope.current_user = res.data.user;
            //$state.transitionTo('home');
        }).catch(function(err){
            $rootScope.current_user = {};
            $rootScope.token = undefined;
        });
        //page validation may be done in backend (use $http service then process at server)
        //if user tries to access login or register page while already logged in
        if($rootScope.token == undefined && toState.name != 'home' && toState.name != "login" && toState.name != 'register'){
            alert('you must login first');
            event.preventDefault();
            $state.transitionTo('login');
        }
        else if($rootScope.token != undefined && (toState.name == "login" || toState.name == 'register')){
            alert('You are already logged in');
            event.preventDefault();
            $state.transitionTo('home');
        }
        //check if the user has access to the desired page
        else if(!isPageAccessible($rootScope.current_user.occupation ,toState.name)){
            alert('You are not authorized to access this page');
            event.preventDefault();
            $state.transitionTo('home');
        }
    });

    function isPageAccessible(occupation, stateName){
        var isPageAccessible = true;
        
        //allowed states for students only
        var allowedStudentStates = ["home", "login", "register", "student", "settings"];
        //admin
        var allowedAdminStates = ["home", "login", "register", "admin", "settings"];


        var isStateAllowed = [];
        
        if(occupation == 'student'){
           isStateAllowed = allowedStudentStates.find(function(state){
                return state == stateName;
            });
        }
        else if(occupation == 'admin'){
            isStateAllowed = allowedAdminStates.find(function(state){
                return state == stateName;
            });
        }

        if(isStateAllowed == undefined){
            isPageAccessible = false;
        }
        ////console.log(isStateAllowed)
        ////console.log(isPageAccessible)
        return isPageAccessible;
    }
});


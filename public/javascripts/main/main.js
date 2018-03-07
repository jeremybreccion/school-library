app.controller('MainController', function($scope, $rootScope, $http, $state){

    $scope.isAdmin = ($rootScope.current_user.role == 'Admin') ? true : false;
    
    $scope.logout = function(){
        $http.get('/users/logout').then(function(){
            console.log('LOGGED OUT');
            $rootScope.current_user = {};
            $rootScope.token = undefined;
            $state.transitionTo('login');
        });
    };
});
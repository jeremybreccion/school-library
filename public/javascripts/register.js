app.controller('RegisterController', function($scope, $http, $state){
    $scope.error_message = '';
    $scope.user = {};

    $scope.register = function(){
        if($scope.user.password != $scope.user.confirm_password){
            $scope.error_message = 'Passwords do not match!';
        }
        else{
            delete $scope.user.confirm_password;
            $scope.user.profile_picture = 'default.jpg';
            $scope.user.current_language = 'english';
            console.log('user to be registered', $scope.user);
            $http.post('/users/register', $scope.user)
            .then(function(res){
                alert(res.data.success_message);
                $state.transitionTo('login');
            })
            .catch(function(err){
                $scope.error_message = err.data.error_message;
            });
        }
    };
});
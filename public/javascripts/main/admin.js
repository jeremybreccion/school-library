app.controller('AdminController', function($scope, BookService, ModalService){
    $scope.message = '';
    $scope.books = [];
    $scope.genres = [];
    $scope.borrowLimit = {};

    $scope.genres = BookService.getGenres();
    $scope.borrowLimit = BookService.getBorrowLimit();

    function resetForm(){
        $scope.book = {
            title: '',
            author: '',
            genre: ''
        }
    }

    function initialize(){
        BookService.getAll().then(function(response){
            $scope.books = response.books;
            resetForm();
        }).catch(function(error){
            $scope.message = error.message;
        });
    }

    initialize();

    $scope.submit = function(){
        BookService.add($scope.book).then(function(response){
            $scope.message = response.message;
            initialize();
            ModalService.hide();
        }).catch(function(error){
            console.log(error);
            $scope.message = error;
        });
    }
});
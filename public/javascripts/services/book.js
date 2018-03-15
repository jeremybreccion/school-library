app.factory('BookService', function($http, $q){
    var service = {};

    service.getAll = getAll;
    service.getGenres = getGenres;
    service.getBorrowLimit = getBorrowLimit;
    service.add = add;
    return service;

    function getAll(){
        return $http.get('/books/getAll').then(function(res){
            return res.data;
        }).catch(function(err){
            return $q.reject(err.data);
        });
    }

    function getGenres(){
        return [
            'action',
            'romance',
            'fantasy',
            'thriller',
            'drama',
            'science fiction',
            'mystery',
            'adventure',
            'comedy'
        ];
    }

    function getBorrowLimit(){
        return {
            min: 1,
            max: 14
        }
    }

    function add(book){
        return $http.post('/books/add', book).then(function(res){
            return res.data;
        }).catch(function(err){
            return $q.reject(err.data);
        });
    }

});
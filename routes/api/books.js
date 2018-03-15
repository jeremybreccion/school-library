var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var config = require('../../config/config.json');
var db = mongo.db(config.database.name, { native_parser: true });
db.bind(config.database.collections.books);
db.bind(config.database.collections.logs)

router.get('/getAll', function(req, res, next){
    db.books.find({}).toArray(function(err, books){
        if(err){
            res.status(400).send(err);
        }
        else if(books.length == 0){
            res.status(200).send({books: []});            
        }
        else{
            res.status(200).send({books: books});
        }
    });
});

//panget naman netong code na to hahaha
router.post('/add', function(req, res, next){
    //get maximum bookID for increments
    db.books.find({}).sort({bookID: -1}).limit(1).toArray(function(err, book){
        if(err){
            res.status(400).send(err);
        }
        else{
            var maxBookID;
            console.log(book);
            if(book.length == 0){
                maxBookID = 1;
            }
            else{
                //since the array has only 1 element, assume get [0]
                maxBookID = book[0].bookID + 1;
            }

            console.log(maxBookID);
            var input = {};
            Object.assign(input, req.body);
            input.bookID = maxBookID;
            input.currentBorrower = '';
            input.borrowStart = '';
            input.borrowEnd = '';
            delete input.quantity;

            var newBooks = [];
            var bookIDs = [];
            for(var i = 0; i < req.body.quantity; i++){
                var perBook = {};
                Object.assign(perBook, input);
                perBook.bookID += i;
                bookIDs.push(maxBookID + i);
                newBooks.push(perBook);
            }
            

            //console.log(newBooks);

            db.books.insertMany(newBooks, function(err, ){
                if(err){
                    res.status(400).send(err);
                }
                else{

                    insertToLogs(req.session.user.schoolID, req.body.title, bookIDs, req.body.quantity, 'added').catch(function(err){
                        res.status(400).send(err);
                    });
                    res.status(200).send({message: 'Book/s added'});
                }
            });
        }
    })
});

function insertToLogs(actorID, bookTitle, bookIDs, action){
    var log = {
        date: new Date(),
        schoolID: actorID,
        bookID: bookIDs,
        action: action
    }
    db.logs.insert(log, function(err){
        if(err){
            throw err;
        }
    });
}

module.exports = router;
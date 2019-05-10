const express = require('express');

function routes(Book) {
    const bookRouter = express.Router();
    bookRouter.route("/books")
        .post((req, res) => {
            const book = new Book(req.body);
            console.log(book);
            book.save();
            return res.status(201).json(book);
        })
        .get((req, res) => {
            const query = {};
            if (req.query.genre) {
                query.genre = req.query.genre;
            }
            console.log(query);
            Book.find(query, (err, books) => {
                if (err) {
                    return res.send(err);
                }
                //  console.log("Printing some stuff ->> " + books)
                return res.json(books);
            });
        });

    //Middleware function 
    bookRouter.use('/books/:bookid',(req,res,next) => {
        Book.findById(req.params.bookid, (err, book) => {
            if (err) {
                return res.sendStatus(404);
            }
             console.log("Using Middleware function");
            req.body = book; 
            return next();
        });
    })
    bookRouter.route("/books/:bookid")
        .get((req, res) => {return res.send(req.body)})
        .put((req,res) => {
            Book.findById(req.params.bookid, (err, book) => {
                if (err) {
                    return res.send(err);
                }
                console.log("Entry");
                console.log(book);
                book.title = req.body.title;
                book.author = req.body.author;
                book.genre = req.body.genre;
                book.save();
                console.log(book);
                return res.json(book);
            });
        });
    return bookRouter;
}

module.exports = routes;
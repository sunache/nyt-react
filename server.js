var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrappednews";

var PORT = process.env.PORT || 3001;

// Serve up static assets
if (process.env.NODE_ENV === "production") {
    app.use(express.static("view/build"));
    console.log(express.static("view/build"));
}
// Initialize Express
var app = express();

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse application/json
app.use(bodyParser.json());

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
    extended: true
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//For Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");
mongoose.Promise = Promise;

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {}, function (err) {
    console.log(err);
});


// Routes

app.get("/", function (req, res) {
    db.Article.find({}, function (error, data) {
        res.render('index', {
            articles: data
        });
        
    })
})

app.get("/saved", function (req, res) {
    db.Article.find({saved:true}, function (error, data) {
        res.render('saved', {
            articles: data
        });

    })
})

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        res.redirect('/');
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// app.get("/saved/:id", function (req, res) {
//     // Remember: when searching by an id, the id needs to be passed in
//     // as (mongojs.ObjectId(IdYouWantToFind))

//     // Update a doc in the books collection with an ObjectId matching
//     // the id parameter in the url
//     db.Article.update({
//             _id: mongoose.ObjectId(req.params.id)
//         }, {
//             // Set "read" to true for the book we specified
//             $set: {
//                 saved: true
//             }
//         },
//         // When that's done, run this function
//         function (error, edited) {ß
//             // show any errors
//             if (error) {
//                 console.log(error);
//                 res.send(error);
//             } else {
//                 // Otherwise, send the result of our update to the browser
//                 console.log(edited);
//                 res.send(edited);
//             }
//         }
//     );
// });
app.get('/saved/:id', function (req, res) {

    var id = req.params.id;
    db.Article.update({
        _id: id
    }, {
        $set: {
            saved: true
        }
    }, function (result) {
        res.status(200).json({
            message: 'changed saved status'
        })
    })
}) 

app.get('/delete/:id', function (req, res) {

    var id = req.params.id;
    db.Article.update({
        _id: id
    }, {
        $set: {
            saved: false
        }
    }, function (result) {
        res.status(200).json({
            message: 'changed saved status'
        })
    })
})

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.findOne({
        _id: req.params.id
    })
        .then(function (dbNote) {
            return db.Article.findOne
        
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

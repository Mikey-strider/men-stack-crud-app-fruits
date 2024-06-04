//server.js

const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require('path')

// ==============Imports Models==================
const FruitModel = require('./models/fruits')

const app = express();

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.listen(3000, () => {
  console.log("Listening on port 3000");
});




// ================Middleware=============


app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
// to give us req.body!

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')))

// ===========================Our Routes==========================



app.delete('/fruits/:fruitId', async (req, res) => {
  const deletedFruit = await FruitModel.findByIdAndDelete(req.params.fruitId);
  res.redirect('/fruits');
})


app.get('/fruits/:fruitId/edit', async (req, res) => {
  const fruitDoc =await FruitModel.findByIdAndUpdate(req.params.fruitId);
  res.render('fruits/edit.ejs', {fruitDoc: fruitDoc});
})

app.put('/fruits/:fruitId', async (req, res) => {
  req.body.isReadyToEat = !!req.body.isReadyToEat;
  const fruit = await FruitModel.findByIdAndUpdate(req.params.fruitId, req.body, {new: true})
  console.log(fruit)
  res.redirect(`/fruits/${req.params.fruitId}`)

})





// The Create Routes
// We want to be able to create a fruit!
// 1. (User) Get the form -----Server needs a route to respond with a form
app.get('/fruits/new', (req, res) => {
  res.render('fruits/new.ejs')
})

// 2. (user) Submit the form ---- Server needs a route to process the form

app.post('/fruits', async (req, res) => {
  // changing item from string to boolean using !! method
  req.body.isReadyToEat = !!req.body.isReadyToEat;
  
  // take the contents of the form
  // and put them in the database!
    const fruit = await FruitModel.create(req.body)
    console.log(fruit);
  res.redirect('/fruits');
})


// Read Routes

// Index route - We want a page that we can view all the fruits
app.get('/fruits', async (req, res) => {

  // We need to go to the database and get every Fruit
  const fruitDocs = await FruitModel.find({});
  // and show those fruits in our ejs package
  // render is looking in the views folder to send back a template
  res.render('fruits/index.ejs', {fruitDocs: fruitDocs});
})

//  Show Route - We want a page that we can view all the details of a single fruit(data)

app.get('/fruits/:fruitId', async (req, res) => {
    // we need to go to the databse and get the fruit by its ID, then inject it into
    // the show.ejs
  const fruitDoc = await FruitModel.findById(req.params.fruitId);
  res.render('fruits/show.ejs', {fruitDoc: fruitDoc});
})





// ========================================

// 



// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

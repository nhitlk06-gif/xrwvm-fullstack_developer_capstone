const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_file = fs.existsSync("reviews.json") ? "reviews.json" : "data/reviews.json";
const dealerships_file = fs.existsSync("dealerships.json") ? "dealerships.json" : "data/dealerships.json";

const reviews_data = JSON.parse(fs.readFileSync(reviews_file, 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync(dealerships_file, 'utf8'));

const Reviews = require('./review');
const Dealerships = require('./dealership');

let mongoConnected = false;
mongoose.connect("mongodb://127.0.0.1:27017/", { dbName: 'dealershipsDB', serverSelectionTimeoutMS: 2000 })
  .then(() => {
    mongoConnected = true;
    Reviews.deleteMany({}).then(() => Reviews.insertMany(reviews_data['reviews']));
    Dealerships.deleteMany({}).then(() => Dealerships.insertMany(dealerships_data['dealerships']));
  })
  .catch(() => {
    console.log("Running with in-memory JSON data (MongoDB offline)");
  });

// Express route to home
app.get('/', async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    if (mongoConnected) {
      const documents = await Reviews.find();
      if (documents && documents.length > 0) return res.json(documents);
    }
  } catch (error) {}
  res.json(reviews_data['reviews']);
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    if (mongoConnected) {
      const documents = await Reviews.find({ dealership: parseInt(req.params.id) });
      if (documents && documents.length > 0) return res.json(documents);
    }
  } catch (error) {}
  const targetId = parseInt(req.params.id);
  const filtered = reviews_data['reviews'].filter(r => r.dealership === targetId);
  res.json(filtered);
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    if (mongoConnected) {
      const documents = await Dealerships.find();
      if (documents && documents.length > 0) return res.json(documents);
    }
  } catch (error) {}
  res.json(dealerships_data['dealerships']);
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    if (mongoConnected) {
      const documents = await Dealerships.find({
        $or: [{ state: req.params.state }, { st: req.params.state }]
      });
      if (documents && documents.length > 0) return res.json(documents);
    }
  } catch (error) {}
  const query = req.params.state.toLowerCase();
  const filtered = dealerships_data['dealerships'].filter(
    d => d.state.toLowerCase() === query || d.st.toLowerCase() === query
  );
  res.json(filtered);
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    if (mongoConnected) {
      const documents = await Dealerships.find({ id: parseInt(req.params.id) });
      if (documents && documents.length > 0) return res.json(documents[0]);
    }
  } catch (error) {}
  const targetId = parseInt(req.params.id);
  const found = dealerships_data['dealerships'].find(d => d.id === targetId);
  res.json(found || {});
});

// Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    let new_id = reviews_data['reviews'].length + 1;
    const newReview = {
      id: new_id,
      name: data['name'],
      dealership: data['dealership'],
      review: data['review'],
      purchase: data['purchase'],
      purchase_date: data['purchase_date'],
      car_make: data['car_make'],
      car_model: data['car_model'],
      car_year: data['car_year']
    };
    reviews_data['reviews'].push(newReview);
    if (mongoConnected) {
      const reviewDoc = new Reviews(newReview);
      await reviewDoc.save();
    }
    res.json(newReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express')
require('dotenv').config()
const fetch = require('node-fetch')
const app = express()
const port = 80
const jwt = require("jsonwebtoken")

const MongoClient = require('mongodb').MongoClient;
const { nextTick } = require('process')
const uri = process.env.MONGODB_AUTH;
const client = new MongoClient(uri, { useUnifiedTopology: true});
let collection;

client.connect(err => {
  collection = client.db("users").collection("users")
})

function generateAccessToken(username) {
  return jwt.sign({user: username}, process.env.SECRET, { expiresIn: '3600000s' });
}

function verifyAccessToken(token){
  let user;
  jwt.verify(token, process.env.SECRET, function(err,decoded){
    if(err)
      return false;
    user = decoded.user;
  })
  return user;
}

function authenticateToken(token){
  let failure;
  jwt.verify(token, process.env.SECRET, function(err,decoded){
    if(err)
      failure = true;
  })
  return failure;
}

app.use(express.static('www'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', function (err) {
  console.error(err);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/signUp', (req, res) => {
  collection.find({username: req.body.username}).toArray(function(err, result) {
    let isFound;
    if(result.length){
      isFound = true;
    }
    if(isFound){
      res.redirect('/welcome?signUp=failed')
    }
    else{
      collection.insertOne({ username: req.body.username, password: req.body.password, photo: '', isNew: true, reviews: [] });
      res.redirect('/welcome?signUp=success')
    }
  })
})

app.post('/logIn', (req, res) => {
  collection.find({username: req.body.username}).toArray(function(err, result) {
    if (err) throw err;
    if (!result.length){
      res.redirect('/welcome?auth=failedUsername')
    }
    else if(req.body.password === result[0].password){
      res.cookie('token',generateAccessToken(req.body.username))
      if(result[0].isNew)
        res.redirect('/onboarding')
      else
        res.redirect('/')
    }
    else{
      res.redirect('/welcome?auth=failedPassword')
    }
  });
})

app.post('/newReview', async (req, res) => {
  await collection.updateOne({username: verifyAccessToken(req.headers.cookie.split('=')[1])},
    { $pull: { reviews: { movie: req.body.movie} } },
    {
      upsert: true
    }
  )
  if(!req.body.deleteEntry){
    await collection.updateOne({username: verifyAccessToken(req.headers.cookie.split('=')[1])},
      {$push: { reviews : {
      $each: [{
        movie: req.body.movie,
        userOpinion: req.body.userOpinion,
        userReview: req.body.userReview
      }],
      $position: 0
    }}})
  }
  res.redirect('/')
})

app.post('/newReviewGallery', async (req, res) => {
  await collection.updateOne({username: verifyAccessToken(req.headers.cookie.split('=')[1])},
    { $pull: { reviews: { movie: req.body.movie} } },
    {
      upsert: true
    }
  )
  if(!req.body.deleteEntry){
    await collection.updateOne({username: verifyAccessToken(req.headers.cookie.split('=')[1])},
      {$push: { reviews : {
      $each: [{
        movie: req.body.movie,
        userOpinion: req.body.userOpinion,
        userReview: req.body.userReview
      }],
      $position: 0
    }}})
  }
  res.redirect('/profile')
})

app.get('/isSeen', (req, res) => {
  collection.find({$and: [{username: verifyAccessToken(req.headers.cookie.split('=')[1])}, {reviews: {$elemMatch:{movie:req.query.movie} }}]}).toArray(function(err, result) {
    if (err) throw err;
    if (!result.length)
      res.send(false)
    else
      res.send(true)
  })
})

app.get('/searchSimple', function(req, res) {
  fetch(`http://www.omdbapi.com/?${req.query.method}=${encodeURIComponent(req.query.searchTitle)}&type=movie&y=${req.query.searchYear}&apikey=${process.env.OMDB_KEY}`)
    .then(res => res.json())
    .then(function(data){
      res.json(data)
    })
});

app.get('/searchAdvanced', function(req, res) {
  fetch(`http://www.omdbapi.com/?i=${req.query.imdbID}&type=movie&plot=full&apikey=${process.env.OMDB_KEY}`)
    .then(res => res.json())
    .then(function(data){
      res.json(data)
    })
});

// app.get('/imageBanner', function(req, res) {
//   fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${encodeURIComponent(req.query.movieTitle)}%20movie%20${req.query.movieYear}&aspect=wide&minWidth=900`, {
//     "method": "GET",
//     "headers": {
//       "x-rapidapi-key": process.env.BING_KEY,
//       "x-rapidapi-host": "bing-image-search1.p.rapidapi.com"
//     }
//   })
//     .then(res => res.json())
//     .then(function(data){
//       res.json(data)
//     })
// });

app.get('/imageBanner', function(req, res){
  fetch(`https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(req.query.movieTitle)}%20movie%20${req.query.movieYear}&aspect=wide&minWidth=900`, {
    "method": "GET",
    "headers": {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY
    }
  })
    .then(res => res.json())
    .then(function(data){
      res.json(data)
    })
})

app.get('/recentReviews', function(req, res) {
    collection.find({username: verifyAccessToken(req.headers.cookie.split('=')[1])}).toArray(function(err, result) {
      res.json(result[0].reviews)
    });
})

app.get('/specificReview', function(req, res){
  let matchedReview;
  collection.find({$and: [{username: verifyAccessToken(req.headers.cookie.split('=')[1])}, {reviews: {$elemMatch:{movie:req.query.movie} }}]}).toArray(function(err, results) {
    if (err) throw err;
    for(let counter = 0; counter < results[0].reviews.length; counter++){
      if(results[0].reviews[counter].movie === req.query.movie){
        matchedReview = results[0].reviews[counter]
        break
      }
    }
    res.send(matchedReview)
  })
})

app.get('/logOut', function(req, res){
  res.cookie('token',{expires: Date.now()})
  res.redirect('/welcome')
})

app.post('/onboarded', async function(req, res){
  await collection.updateOne({username: verifyAccessToken(req.headers.cookie.split('=')[1])},
      { $set: { photo : req.body.picture, isNew : false}})
  res.redirect('/')
});

app.post('/deleteAccount', async function(req,res){
  collection.find({username: verifyAccessToken(req.headers.cookie.split('=')[1])}).toArray(function(err, result) {
    if (err) throw err;
    if(req.body.password === result[0].password){
      collection.remove({username: verifyAccessToken(req.headers.cookie.split('=')[1])})
      res.redirect('/welcome')
    }
    else
      res.redirect('/settings?auth=failedPassword')
  });
})

app.post('/changePassword', async function(req,res){
  collection.find({username: verifyAccessToken(req.headers.cookie.split('=')[1])}).toArray(function(err, result) {
    if(req.body.currentPassword === result[0].password){
      collection.updateOne({username: verifyAccessToken(req.headers.cookie.split('=')[1])},
      { $set: { password : req.body.newPassword}})
      res.redirect('/settings?updatePassword=success')
    }
    else
      res.redirect('/settings?auth=failedPassword')
  });
})

app.get('*', function(req, res) {
  res.redirect('/404');
});
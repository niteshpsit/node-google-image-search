var express = require('express');
var router = express.Router();
var GoogleImages = require('google-images');
var fs = require('fs');
var path = require("path");
var url = require("url");
var request = require('request');
var async = require('async');
var config = require("../constant/config");
var Image = require('../models/images');
/*
*  To get the images from google and save to the public folder of the server
*  After storing the image save the paths of image in the database with related word 
 */
router.post('/', function(req, res, next) {
  const client = new GoogleImages(config.CSE_ID, config.API_KEY);
  const searchWord = req.query.search;
  var imageList = []
  client.search(searchWord)
  .then(images => {
      async.every(images,function(image,callback){
        var imageUrl = image.url;
        var imagePublicPath = path.basename(imageUrl);
        var filename = path.join(__dirname,'..','public', 'images',imagePublicPath);
        if(config.isImageType(filename)){
          request.head(imageUrl, function(err, res, body){
            /**
             * Storing Data to public folder to the server
             */
            request(imageUrl).pipe(fs.createWriteStream(filename)).on('close', function(){
              imageList.push(imagePublicPath);
              callback(null,true);
            });
          });
        }else {
          callback(null,true);
        }
      },function(err, result){
        if(err){
          res.status(500).json({message:"some thing went wrong"});
          return false;
        }
        /**
         * Storing url of image in the database
         */
        var newImageList = Image({
          word: searchWord,
          imageList: imageList
        });
        
        newImageList.save(function(err) {
          if (err) {
            res.status(500).json(err);
            return false
          }
          res.json({message:"image saved"});
        });
      });
    })
  .catch(err => {
    res.status(500).json(err);
  });
});

/* GET List of Images. for a perticular word */
router.get('/', function(req, res, next) {
  const searchWord = req.query.search;
  Image.findOne({word: searchWord}, function(err, images) {
    if (err) {
      res.status(500).json(err);
      return false
    }
    res.json({ images: images.imageList});
  });
});

/* GET List of All submitted word to the databases.*/
router.get('/words', function(req, res, next) {
  Image.find({}, function(err, images) {
    if (err) {
      res.status(500).json(err);
      return false
    }
    var wordList = images.map(image => image.word);
    res.json({ words: wordList});
  });
});

module.exports = router;

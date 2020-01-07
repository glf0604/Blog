var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

var responseDate;
router.use(function(req, res, next) {
  responseDate = {
    code: 0,
    message: ''
  };
  next()
});

router.post('/user/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  
  if (username === '') {
    responseDate.code = 1;
    responseDate.message = 'Username cannot null!';
    res.json(responseDate);
    return
  }
  if (password === '') {
    responseDate.code = 2;
    responseDate.message = 'Password cannot null!';
    res.json(responseDate);
    return
  }
  if (password !== repassword) {
    responseDate.code = 3;
    responseDate.message = 'The two passwords did not match';
    res.json(responseDate);
    return
  }
  User.findOne({
    username: username
  })
    .then(function(userInfo) {
      if (userInfo) {
        responseDate.code = 4;
        responseDate.message = 'Username has been registered';
        res.json(responseDate);
        return
      }
      var user = new User({
        username: username,
        password: password
      });
      return user.save()
    })
    .then(function(newUserInfo) {
      responseDate.message = 'Registered successfully';
      res.json(responseDate)
    })
});

router.post('/user/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    responseDate.code = 1;
    responseDate.message = 'Username or Password cannot null!!';
    res.json(responseDate);
    return
  }
  User.findOne({
    username: username,
    password: password
  }).then(function(userInfo) {
    if (!userInfo) {
      responseDate.code = 2;
      responseDate.message = 'Username or Password Error!!';
      res.json(responseDate);
      return
    }
    responseDate.message = 'Login Successful!!';
    responseDate.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    };
    req.cookies.set(
      'userInfo',
      JSON.stringify({
        _id: userInfo._id,
        username: userInfo.username
      })
    );
    res.json(responseDate);
    return
  })
});
router.get('/user/logout', function(req, res) {
  req.cookies.set('userInfo', null);
  res.json(responseDate)
});

router.get('/comment', function(req, res) {
  var contentId = req.query.contentid || '';

  Content.findOne({
    _id: contentId
  }).then(function(content) {
    responseDate.data = content.comments;
    res.json(responseDate)
  })
});

router.post('/comment/post', function(req, res) {
  var contentId = req.body.contentid || '';
  var postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  };

  Content.findOne({
    _id: contentId
  })
    .then(function(content) {
      content.comments.push(postData);
      return content.save()
    })
    .then(function(newContent) {
      responseDate.message = 'Comment successful!';
      responseDate.data = newContent;
      res.json(responseDate)
    })
});

module.exports = router;

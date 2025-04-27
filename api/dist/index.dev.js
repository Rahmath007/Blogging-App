"use strict";

var express = require('express');

var cors = require('cors');

var mongoose = require("mongoose");

var User = require('./models/User');

var Post = require('./models/Post');

var bcrypt = require('bcryptjs');

var app = express();

var jwt = require('jsonwebtoken');

var cookieParser = require('cookie-parser');

var multer = require('multer');

var uploadMiddleware = multer({
  dest: __dirname + '/uploads/'
});

var fs = require('fs');

require('dotenv').config();

var salt = bcrypt.genSaltSync(10);
var secret = 'adhasdhsahdhsainsafusaiufaf';
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express["static"](__dirname + '/uploads'));
mongoose.connect('mongodb+srv://blog:pJNASYx0CS6j90vp@cluster0.v8kw5va.mongodb.net/?retryWrites=true&w=majority');
app.post('/register', function _callee(req, res) {
  var _req$body, username, password, userDoc;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.create({
            username: username,
            password: bcrypt.hashSync(password, salt)
          }));

        case 4:
          userDoc = _context.sent;
          res.json(userDoc);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          res.status(400).json(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
app.post('/login', function _callee2(req, res) {
  var _req$body2, username, password, userDoc, passOk;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 3:
          userDoc = _context2.sent;
          passOk = bcrypt.compareSync(password, userDoc.password);

          if (passOk) {
            // login success
            jwt.sign({
              username: username,
              id: userDoc._id
            }, secret, {}, function (err, token) {
              if (err) throw err;
              res.cookie('token', token).json({
                id: userDoc._id,
                username: username
              });
            });
          } else {
            res.status(400).json('wrong credentials');
          }

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.get('/profile', function (req, res) {
  var token = req.cookies.token;
  jwt.verify(token, secret, {}, function (err, info) {
    if (err) throw err;
    res.json(info);
  });
});
app.post('/logout', function (req, res) {
  res.cookie('token', '').json('ok');
});
app.post('/post', uploadMiddleware.single('file'), function _callee4(req, res) {
  var _req$file, originalname, path, parts, ext, newPath, token;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$file = req.file, originalname = _req$file.originalname, path = _req$file.path;
          parts = originalname.split('.');
          ext = parts[parts.length - 1];
          newPath = path + '.' + ext;
          fs.renameSync(path, newPath);
          token = req.cookies.token;
          jwt.verify(token, secret, {}, function _callee3(err, info) {
            var _req$body3, title, summary, content, postDoc;

            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!err) {
                      _context3.next = 2;
                      break;
                    }

                    throw err;

                  case 2:
                    _req$body3 = req.body, title = _req$body3.title, summary = _req$body3.summary, content = _req$body3.content;
                    _context3.next = 5;
                    return regeneratorRuntime.awrap(Post.create({
                      title: title,
                      summary: summary,
                      content: content,
                      cover: newPath,
                      author: info.id
                    }));

                  case 5:
                    postDoc = _context3.sent;
                    res.json(postDoc);

                  case 7:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app.put('/post', uploadMiddleware.single('file'), function _callee6(req, res) {
  var newPath, _req$file2, originalname, path, parts, ext, token;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          newPath = null;

          if (req.file) {
            _req$file2 = req.file, originalname = _req$file2.originalname, path = _req$file2.path;
            parts = originalname.split('.');
            ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
          }

          token = req.cookies.token;
          jwt.verify(token, secret, {}, function _callee5(err, info) {
            var _req$body4, id, title, summary, content, postDoc, isAuthor;

            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!err) {
                      _context5.next = 2;
                      break;
                    }

                    throw err;

                  case 2:
                    _req$body4 = req.body, id = _req$body4.id, title = _req$body4.title, summary = _req$body4.summary, content = _req$body4.content;
                    _context5.next = 5;
                    return regeneratorRuntime.awrap(Post.findById(id));

                  case 5:
                    postDoc = _context5.sent;
                    isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

                    if (isAuthor) {
                      _context5.next = 9;
                      break;
                    }

                    return _context5.abrupt("return", res.status(400).json('Your are not the author of this post'));

                  case 9:
                    _context5.next = 11;
                    return regeneratorRuntime.awrap(postDoc.update({
                      title: title,
                      summary: summary,
                      content: content,
                      cover: newPath ? newPath : postDoc.cover
                    }));

                  case 11:
                    res.json(postDoc);

                  case 12:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
});
app.get('/post', function _callee7(req, res) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.t0 = res;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Post.find().populate('author', ['username']).sort({
            createdAt: -1
          }).limit(20));

        case 3:
          _context7.t1 = _context7.sent;

          _context7.t0.json.call(_context7.t0, _context7.t1);

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
});
app.get('/post/:id', function _callee8(req, res) {
  var id, postDoc;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Post.findById(id).populate('author', ['username']));

        case 3:
          postDoc = _context8.sent;
          res.json(postDoc);

        case 5:
        case "end":
          return _context8.stop();
      }
    }
  });
});
app["delete"]('/post/:id', function _callee9(req, res) {
  var id, deletedPost;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          id = req.params.id;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(Post.findByIdAndDelete(id));

        case 4:
          deletedPost = _context9.sent;

          if (!deletedPost) {
            // If the post was not found, send a 404 status code and error message
            res.status(404).json({
              message: 'Post not found'
            });
          } else {
            // If the post was successfully deleted, send a success message
            res.json({
              message: 'Post deleted successfully'
            });
          }

          _context9.next = 12;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](1);
          // If an error occurred during deletion, send a 500 status code and error message
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
app.listen(4000); //mongodb+srv://blog:NuISz2RpwKqkydtr@cluster0.99nbzir.mongodb.net/?retryWrites=true&w=majority
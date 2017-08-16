'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var jwt = require('jsonwebtoken');
var uuidv1 = require('./lib/MelonUuid');

app.db = dynamo;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// middlewares add
app.use('/apiwithauth', require('./middlewares/auth'));

// app controllers
app.use('/', require('./routes'));

app.post('/users/regis', function (req, res) {
  var params = {
    TableName: 'users',
    Item: {
      'id': '123e4567e89b12d3a456426655440000',
      'birthday': new Date('1994-02-06').getTime(),
      'created_at': new Date().getTime(),
      'email': req.body.email,
      'eo': [],
      'fcm': req.body.fcm,
      'fname': req.body.fname,
      'gender': req.body.gender,
      // 'id': '' + uuidv1(),
      'is_active': true,
      'jwt': 'aa',
      'lname': req.body.lname,
      'password': req.body.password,
      'phone': {
        'code': req.body.phonecode,
        'number': req.body.phonenumber
      },
      'photo': req.body.photo,
      'role': 'user',
      'social': [],
      'updated_at': new Date().getTime()
    }
  };
  app.db.putItem(params, function (err, data) {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
      res.json(JSON.stringify(err, null, 2));
    } else {
      console.log('Added item:', uuidv1());
      res.json(data);
    }
  });
});
module.exports = app;
// npm install firebase

// ref: https://firebase.google.com/docs/database/web/read-and-write

var express = require('express');
var router = express.Router();

const firebase = require('firebase')

// set middleware
router.use('/',function (req, res, next) {
    const onTime = new Date()
    console.log(onTime)
    next()
  })

var config = {
      databaseURL: "https://hihi-65b69.firebaseio.com" // enter your databaseURL（輸入由firebase中申請到的firebase的databaseURL）
  };

firebase.initializeApp(config);

  // Get a reference to the database service
var database = firebase.database();
//自動生成 id
//參考資料：https://github.com/tracker1/node-uuid4
const uuid = require('uuid4');
var id = uuid();


router.get('/getdata', function (req, res, next) {
    // once -> 取得資料
    firebase.database().ref('users/').once('value', function (snapshot) {
      console.log(snapshot.val());
      res.json({
          result: '成功取得資料'
        })
    });
})
router.post('/postdata', function (req, res, next) {
    // set -> 建立新的資料
    // 將 id 置於 req.query.id
    firebase.database().ref('users/' + req.query.id).set({
        username: req.body.username,
        email: req.body.email
      });
      res.json({
          result: '成功建立資料'
        })
  });

router.put('/putdata', function (req, res, next) {
    // update -> 更新指定資料
    firebase.database().ref('users/' + req.query.id).update({
        username: req.body.username,
        email: req.body.email
    });
    res.json({
        result: '成功更新資料'
        })
  });

router.delete('/deletedata', function (req, res, next) {
    // remove -> 刪除指定資料
    firebase.database().ref('users/' + req.query.id).remove()
    res.json({
        result: '成功刪除資料'
        })
  });

module.exports = router;

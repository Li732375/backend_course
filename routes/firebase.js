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

const uuidv4 = require('uuid/v4');


router.post('/product', function (req, res, next) {
    const name = req.body.name
    const price = req.body.price
    // 試著判斷前端在request中是否有正常的輸入request的key。
    if (name === undefined || price === undefined || name === '' || price === '') {
        res.status(400).json({
            result: '請在request的輸入name及price的key值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('products/' + uuidv4()).set({
        name: req.body.name,
        price: req.body.price
    });
    res.status(200).json({
        result: '產品新增成功'
    })
})

// + GET - 提取所有產品資料（包含產品名稱、價格）
router.get('/product/all', function (req, res, next) {
    firebase.database().ref('products/').once('value', function (snapshot) {
        // console.log(snapshot.val());
        res.status(200).json({
            result: snapshot.val()
        })
    });
})

// + GET - 提取單一產品資料（包含產品名稱、價格）
router.get('/product', function (req, res, next) {
    // console.log('query value: ', req.query.id)
    const id = req.query.id
    if (id === undefined || id === '') {
        res.status(400).json({
            result: '請在request的輸入id的query值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('products/' + id).once('value', function (snapshot) {
        // console.log(snapshot.val());
        res.status(200).json({
            result: snapshot.val()
        })
    });
})

// + PUT - 更改產品（可選擇只修改產品名稱或只修改價格）
router.put('/product', function (req, res, next) {
    const id = req.query.id
    const name = req.body.name
    const price = req.body.price
    // 試著判斷前端在request中是否有正常的輸入request的key。
    if (id === undefined|| id === '') {
        res.status(400).json({
            result: '請在query中輸入id值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('products/' + id).update({
        name: name,
        price: price
    });
    res.json({
        result: '修改成功'
    })
})

// + DELETE - 刪除產品
router.delete('/product', function (req, res, next) {
    const id = req.query.id
    if (id === undefined|| id === '') {
        res.status(400).json({
            result: '請在query中輸入id值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    // remove -> 刪除指定users中指定對象的資料
    firebase.database().ref('products/' + id).remove()
    res.json({
        result: '刪除成功'
    })
})

router.post('/member', function (req, res, next) {
    const a = req.body.account
    const p = req.body.password
    // 試著判斷前端在request中是否有正常的輸入request的key。
    if (a === undefined || p === undefined || a === '' || p === '') {
        res.status(400).json({
            result: '請在request的輸入account及password的key值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }

    // set -> 在users中建立新的資料，並使用uuid來做唯一值（與資料庫的id概念類似，可想像成「primary key」）
    firebase.database().ref('members/' + uuidv4()).set({
        account:req.body.account,
        password:req.body.password
    });
    console.log(decoded)
    res.status(200).json({
        result: '會員註冊完成'
    })
})

//token生產
var jwt = require('jsonwebtoken')

router.post('/member/login', function (req, res, next) {
    const a = req.body.account
    const p = req.body.password
    // 試著判斷前端在request中是否有正常的輸入request的key。
    if (a === undefined || p === undefined || a === '' || p === '') {
        res.status(400).json({
            result: '請在request的輸入account及password的key值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    // 帳號確認
    firebase.database().ref('members/').orderByChild('account').
      equalTo(a).on('value', function (snapshot) {
        if (snapshot.val() === null) {
            res.json({
                result: '無該帳號'
            })
          return
        }
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: a
          }, 'secret');

        const decoded = jwt.verify(token, 'secret');

        res.json({
            token
        })
    });
})

//新增訂單
router.post('/order', function (req, res, next) {
    const productName = req.body.productName
    const quantity = req.body.quantity
    const token = req.query.token
    // 試著判斷前端在request中是否有正常的輸入request的key。

    if (productName === undefined || quantity === undefined ||
        token === undefined || productName === '' || quantity === '' ||
        token === '') {
        console.log(decoded)
        res.status(400).json({
            result: '請在request的body中輸入name及price的key值，並在query中輸入token值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    const decoded = jwt.verify(token, 'secret');
    const account = decoded.data

    firebase.database().ref('orders/' + uuidv4()).set({
        account,
        productName,
        quantity,
    });

    res.status(200).json({
        result: '產品新增成功'
    })
})

router.get('/order', function (req, res, next) {
    const productName = req.body.productName
    const quantity = req.body.quantity
    const token = req.query.token
    // 試著判斷前端在request中是否有正常的輸入request的key。

    if (productName === undefined || quantity === undefined ||
        token === undefined || productName === '' || quantity === '' ||
        token === '') {
        console.log(decoded)
        res.status(400).json({
            result: '請在request的body中輸入name及price的key值，並在query中輸入token值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    const decoded = jwt.verify(token, 'secret');
    const account = decoded.data

    const id = req.query.id
    if (id === undefined || id === '') {
        res.status(400).json({
            result: '請在request的輸入id的query值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
    }
    firebase.database().ref('products/' + id).once('value', function (snapshot) {
        // console.log(snapshot.val());
        res.status(200).json({
            result: snapshot.val()
        })
    });
})

module.exports = router;

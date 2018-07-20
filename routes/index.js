var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    say:'hi',
    no:'hi'
  })
});

router.post('/text',function(req, res, next){
    console.log(req.body);
    res.json({
      result: req.body,
    })
});

router.put('/text2',function(req, res, next){
    console.log('it is put method.');
    console.log(req.body);
    res.json({
      result: req.body,
    })
});

router.delete('/text3',function(req, res, next){
    console.log('it is delete method.');
    console.log(req.body);
    res.json({
      result: req.body,
    })
});

router.use('/',function (req, res, next) {
    const onTime = new Date()
    console.log(onTime)
    next()
  })
module.exports = router;

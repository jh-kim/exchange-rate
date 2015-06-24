var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

var Xchange = require('./app/xchange').Xchange;
var xchange = new Xchange();

router.get('/', function(req, res) {
  res.json({ message: 'welcome to Exchangerate api' });
});

router.route('/xchange')
  .get(function(req, res) {
    function callback(item) {
      res.json(item);
    }
    var from = req.query.from;
    var to = req.query.to;
    var amount = req.query.amount;
    xchange.getRate(from, to, amount, callback);
});

// register routes
app.use('/api', router);

// start server
app.listen(port);
console.log('Start Exchangerate API on port : ' + port);
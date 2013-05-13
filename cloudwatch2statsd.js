var awssum = require('awssum');
var amazon = require('awssum-amazon');
var CloudWatch = require('awssum-amazon-cloudwatch').CloudWatch;
var elb = require('./lib/elb.js');

var cw = new CloudWatch({
    'accessKeyId'     : process.env.AWS_ID,
    'secretAccessKey' : process.env.AWS_SECRET,
    'region'          : amazon.US_WEST_2
});

elb.find(cw, /^.*0502$/, function(err, elbs) {
  if (err) console.error("fatal error:", err);
  elbs.forEach(function(x) {
    elb.stats(cw, x, function(err, data) {
      console.log(err, JSON.stringify(data, null, "  "));
    });
  });
});

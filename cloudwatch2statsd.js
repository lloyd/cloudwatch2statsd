var awssum = require('awssum');
var amazon = require('awssum-amazon');
var CloudWatch = require('awssum-amazon-cloudwatch').CloudWatch;

var cw = new CloudWatch({
    'accessKeyId'     : process.env.AWS_ID,
    'secretAccessKey' : process.env.AWS_SECRET,
    'region'          : amazon.US_WEST_2
});

cw.ListMetrics({
  Namespace: 'AWS/ELB'
}, function(err, data) {
  console.log(err, 'Error');
  console.log(JSON.stringify(data, null, 2));
});

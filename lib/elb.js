var jsel = require('JSONSelect'),
       _ = require('underscore');


// find all elbs by name matching a pattern
exports.find = function(cw, pattern, cb) {
  if (!cb && pattern) {
    cb = pattern;
    pattern = null;
  }

  if (_.isRegExp(pattern)) {
    var _re = pattern;
    pattern = function(x) { return _re.test(x); }
  }

  var ELBs = [];

  // first we'll fetch ALL ELBs, following next tokens and get them into an array
  function next(token) {
    var options = {
      Namespace: 'AWS/ELB',
      'Dimensions': [
        {
          Name: 'LoadBalancerName'
        }
      ],
      MetricName: "HealthyHostCount"
    };
    if (token) options.NextToken = token;

    cw.ListMetrics(options, function(err, data) {
      if (err) return cb(err);
      var m = jsel.match('.Dimensions > .member :has(:root > .Name:val("LoadBalancerName")) > .Value', data);
      ELBs = ELBs.concat(m);
      var nt = jsel.match('.NextToken', data);
      if (nt.length > 0) next(nt[0]);
      else {
        m = _.uniq(m.sort(), true);
        if (pattern) m = _.filter(m, pattern);
        cb(null, m);
      }
    });
  }

  next();
}

exports.stats = function(cw, elbName, cb) {
  var options = {
    Namespace: 'AWS/ELB',
    'Dimensions': [
      {
        Name: 'LoadBalancerName',
        Value: elbName
      }
    ]
  };

  cw.ListMetrics(options, function(err, data) {
    if (err) return cb(err);
    console.log(JSON.stringify(data, null, "  "));

  });
};

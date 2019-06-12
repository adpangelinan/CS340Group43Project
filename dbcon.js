var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_pangelia',
  password        : '0359',
  database        : 'cs340_pangelia'
});

module.exports.pool = pool;

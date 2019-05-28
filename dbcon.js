var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 100,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_jazdzewj',
  password        : '4174',
  database        : 'cs340_jazdzewj'
});

module.exports.pool = pool;

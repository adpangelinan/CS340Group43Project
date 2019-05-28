module.exports = function(){
    var express = require('express');
    var router = express.Router();
function getLocs(req,res){
    var mysql = req.app.get('mysql');
    var context = {};
    mysql.pool.query("SELECT * FROM Locations",function(err,rows){
        if (err){
            console.log(err);
        } else {
            context.locations = rows;
            //console.log(rows[0]);
            res.render('addChar',context);
            }
    });
}
router.get('/',function(req,res){
    getLocs(req,res);
});

router.post('/', function(req, res){
    console.log(req.body.alias);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO People (FName, LName, Alias, Race, HomeLocation) VALUES (?,?,?,?,?)";
    var inserts = [req.body.fname, req.body.lname, req.body.alias, req.body.race, req.body.homeLocation];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewChar');
        }
    });
});
return router;
}();
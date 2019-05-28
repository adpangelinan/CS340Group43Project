module.exports = function(){
    var express = require('express');
    var router = express.Router();
function getPows(req,res){
    var mysql = req.app.get('mysql');
    var context = {};
    mysql.pool.query("SELECT * FROM Powers",function(err,rows){
        if (err){
            console.log(err);
        } else {
            context.power = rows;
            res.render('viewPow',context);
            }
    });
}
router.get('/',function(req,res){
    getPows(req,res)
});
router.post('/', function(req, res){
    console.log(req.body.Name);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Powers (Name, Category) VALUES (?,?)";
    var inserts = [req.body.Name, req.body.Category];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewPow');
        }
    });
});
return router;
}();
module.exports = function(){
    var express = require('express');
    var router = express.Router();
function getGrps(req,res){
    var mysql = req.app.get('mysql');
    var context = {};
    mysql.pool.query("SELECT * FROM Groups",function(err,rows){
        if (err){
            console.log(err);
        } else {
            context.group = rows;
            res.render('viewGrp',context);
            }
    });
}
router.get('/',function(req,res){
    getGrps(req,res)
});
router.post('/', function(req, res){
    console.log(req.body.Name);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Groups (Name, Category,OperationalCapacity) VALUES (?,?,?)";
    var inserts = [req.body.Name, req.body.Category,req.body.OperationalCapacity];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewGrp');
        }
    });
});
return router;
}();
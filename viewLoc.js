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
            context.location = rows;
            //console.log(rows[0]);
            res.render('viewLoc',context);
            }
    });
}
router.get('/',function(req,res){
    getLocs(req,res);
});
router.post('/', function(req, res){
    console.log(req.body.Name);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Locations (Name, City, Region, Planet) VALUES (?,?,?,?)";
    var inserts = [req.body.Name, req.body.City, req.body.Region, req.body.Planet];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewLoc');
        }
    });
});
return router;
}();
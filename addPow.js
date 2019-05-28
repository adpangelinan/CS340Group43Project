module.exports = function(){
    var express = require('express');
    var router = express.Router();
    function getInfo(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        mysql.pool.query('SELECT People.FName, People.LName, Powers.Name AS Powers, People.ID as PID, Powers.ID AS PoID FROM Powers INNER JOIN People_Power ON Powers.ID=powID INNER JOIN People ON pepID=People.ID',function(err,rows){
            if (err){
                console.log(err);
            } else {
                for (var a=0;a<rows.length;a++){
                    rows[a].Name = rows[a].FName + " " + rows[a].LName;
                }
                context.people = rows;
                res.render('addPow',context);
            }
        });
    }
    router.get('/', function(req,res){
        getInfo(req,res)
    });
    router.post('/', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO People_Power (pepID,powID) VALUES (?,?)";
        var inserts = [req.body.Name, req.body.Power];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/addPow');
            }
        });
    });
    return router;
}
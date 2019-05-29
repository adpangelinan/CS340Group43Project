module.exports = function(){
    var express = require('express');
    var router = express.Router();
    function getRival1(req,res){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT FName,LName FROM Allies_Enemies INNER JOIN People ON pepOneID=ID WHERE AorE=0",function(err,rows){
            if (err){
                console.log(err);
            } else {
                return rows;
            }
        });
    }
    function getRival2(req,res){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT FName,LName FROM Allies_Enemies INNER JOIN People ON pepTwoID=ID WHERE AorE=0",function(err,rows){
            if (err){
                console.log(err);
            } else {
                return rows;
            }
        });
    }
    function getNames(req,res){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT FName,LName, ID FROM People",function(err,rows){
            if (err){
                console.log(err);
            } else {
                return rows;
            }
        });
    }
    router.get('/', function(req,res){
        console.log("...");
        var context = {};
        context.People = getNames(req,res);
        context.People2 = context.People;
        var rivObj = [];
        var riv1Arr = getRival1(req,res);
        var riv2Arr = getRival2(req,res);
        for (var a=0;a<riv1Arr.length;a++){
            rivObj[a] = {};
            rivObj[a].Rival1 = riv1Arr[a].FName + " " + riv1Arr[a].LName;
            rivObj[a].Rival2 = riv2Arr[a].FName + " " + riv2Arr[a].LName;
        }
        context.Rivals = rivObj;
        console.log(context);
        res.render('viewRivals',context);
    });
    router.post('/', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Allies_Enemies (pepOneID,pepTwoID,AorE) VALUES (?,?,?)";
        var inserts = [req.body.Rival1, req.body.Rival2, req.body.AorE];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/viewRivals');
            }
        });
    });
    return router
}();
module.exports = function(){
    var express = require('express');
    var router = express.Router();
    function getRival1(req,res){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT FName,LName, ID AS ID1 FROM Allies_Enemies INNER JOIN People ON pepOneID=ID WHERE AorE=0",function(err,rows){
            if (err){
                console.log(err);
            } else {
                return rows;
            }
        });
    }
    function getRival2(req,res){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT FName,LName, ID AS ID2 FROM Allies_Enemies INNER JOIN People ON pepTwoID=ID WHERE AorE=0",function(err,rows){
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
        var context = {};
        context.jsscripts = ["deleteChar.js"]
        context.People = getNames(req,res);
        context.People2 = context.People;
        var rivObj = [];
        var riv1Arr = getRival1(req,res);
        var riv2Arr = getRival2(req,res);
        for (var a=0;a<riv1Arr.length;a++){
            rivObj[a] = {};
            rivObj[a].Rival1 = riv1Arr[a].FName + " " + riv1Arr[a].LName;
            rivObj[a].Rival2 = riv2Arr[a].FName + " " + riv2Arr[a].LName;
            rivObj[a].ID1 = riv1Arr.ID1;
            rivObj[a].ID2 = riv2Arr.ID2;
        }
        context.Rivals = rivObj;
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

    router.delete('/:id1/:id2',function(req,res){
        var mysql = req.app.get('mysql');
    var sql = "DELETE FROM Allies_Enemies WHERE pepOneID=? AND pepTwoID =?";
    var inserts = [req.params.id1,req.params.id2];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.status(202).end();
        }
    })
    })
    return router
}();
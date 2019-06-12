module.exports = function(){
    var express = require('express');
    var router = express.Router();
    function getRival2(mysql){
        mysql.pool.query("SELECT FName,LName FROM Allies_Enemies INNER JOIN People ON pepTwoID=ID WHERE AorE=0",function(err,rows){
            if (err){
                console.log(err);
            } else {
                return rows;
            }
        });
    }
    function getNames(mysql){
        mysql.pool.query("SELECT FName,LName, ID FROM People",function(err,rows){
            if (err){
                console.log(err);
            } else {
                return rows;
            }
        });
    }
    router.get('/', function(req,res){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT FName,LName, ID, AorE FROM Allies_Enemies INNER JOIN People ON pepOneID=ID",function(err,riv1Arr){
            if (err){
                console.log(err);
            } else {
                mysql.pool.query("SELECT FName,LName, ID FROM Allies_Enemies INNER JOIN People ON pepTwoID=ID",function(err,riv2Arr){
                    if (err){
                        console.log(err);
                    } else {
                        
                        mysql.pool.query("SELECT FName,LName, ID FROM People",function(err,rows){
                            if (err){
                                console.log(err);
                            } else {
                                var context = {};
                                context.jsscripts = ["deleteChar.js"];
                                context.People = rows;
                                context.People2= rows;
                                var rivObj = [];
                                for (var a=0;a<riv1Arr.length;a++){
                                    rivObj[a] = {};
                                    rivObj[a].Rival1 = riv1Arr[a].FName + " " + riv1Arr[a].LName;
                                    rivObj[a].Rival2 = riv2Arr[a].FName + " " + riv2Arr[a].LName;
                                    rivObj[a].ID1 = riv1Arr[a].ID;
                                    rivObj[a].ID2 = riv2Arr[a].ID;
                                    if (riv1Arr[a].AorE == 1){
                                        rivObj[a].AoE = "Ally";
                                    } else {
                                        rivObj[a].AoE = "Enemy";
                                    }
                                }
                                context.Rivals = rivObj;
                                res.render('viewRivals',context);
                            }
                        });
                    }
                });
            } 
        });
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
        var sql = "DELETE FROM Allies_Enemies WHERE pepOneID = ? AND pepTwoID=?";
        var inserts = [req.params.id1,req.params.id2];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
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

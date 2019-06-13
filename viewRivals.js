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
        mysql.pool.query("SELECT People.FName,People.LName, People.ID,p1.FName AS FName2 ,p1.LName AS LName2,p1.ID AS ID2, AorE FROM Allies_Enemies INNER JOIN People ON pepOneID=People.ID LEFT JOIN People p1 ON pepTwoID=p1.ID",function(err,riv1Arr){
            if (err){
                console.log(err);
            } else {
                        mysql.pool.query("SELECT FName,LName, ID FROM People",function(err,rows){
                            console.log(riv1Arr);
                            console.log(riv1Arr.length);
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
                                    rivObj[a].Rival2 = riv1Arr[a].FName2 + " " + riv1Arr[a].LName2;
                                    rivObj[a].ID1 = riv1Arr[a].ID;
                                    rivObj[a].ID2 = riv1Arr[a].ID2;
                                    if (riv1Arr[a].AorE == 1){
                                        rivObj[a].AoE = "Ally";
                                    } else {
                                        rivObj[a].AoE = "Enemy";
                                    }
                                }
                                context.Rivals = rivObj;
                                console.log(rivObj);
                                console.log(rivObj.length);
                                res.render('viewRivals',context);
                            }
                        });
                    }
                });
            }) 
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

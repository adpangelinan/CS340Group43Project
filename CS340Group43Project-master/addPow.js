module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function dup(req,name){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT Name FROM Powers WHERE Name=?",[name],function(err,rows){
            if (err){
                console.log(err);
                return 404;
            } else if (rows.length===0){
                return 0;
            } else {
                return 1;
            }
        })
        return 0;
    }


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
                context.pep = rows;
                context.peop = rows;
                console.log(rows);
                res.render('addPow',context);
            }
        });
    }
    router.get('/', function(req,res){
        getInfo(req,res);
    });
    router.post('/', function(req, res){
        var dups = dup(req,req.body.Name);
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO People_Power (pepID,powID) VALUES (?,?)";
        if (req.body.Name===""){
            alert("Name cannot be blank.");
            res.redirect('/addPow');
        } else if (dups){
            alert("Cannot have the same name as another power");
            res.redirect('/addPow');
        } else {
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
        }
    });
    return router;
}();
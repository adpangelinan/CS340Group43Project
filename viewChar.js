module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getChars(req,res){
        var mysql = req.app.get('mysql');
        var context = {};
        mysql.pool.query("SELECT People.ID AS ID, FName, LName, Alias, Region, City, Race FROM People INNER JOIN Locations ON People.HomeLocation=Locations.id",function(err,rows){
            if (err){
                console.log("error= ");
                console.log(err);
            } else {
                context.people = rows;
                for (var a=0;a<rows.length;a++){
                    console.log(rows[a]);
                }
                res.render('viewChar',context);
                }
        });
    }

    function getCharsForUpdate(res, mysql, context, id, complete) {
        var sql = "SELECT People.ID AS ID, FName, LName, Alias, Race, HomeLocation FROM People WHERE People.ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (err, results) {
            if (err) {
                console.log("error= ");
                console.log(err);
            } else {
                context.people = results[0];
                console.log(results[0]);
                complete();
            }
        });
    }

    router.get('/',function(req,res){
        getChars(req,res);
    });


    router.get('/:id', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateChar.js"];
        var mysql = req.app.get('mysql');
        getCharsForUpdate(res, mysql, context, req.params.id, complete);
        //Add get Location here
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('updateChar', context);
            }
        }


    });


    router.put('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE People SET FName=?, LName=?, Alias =?, Race =?, HomeLocation=? WHERE character_id=?";
        var inserts = [req.body.FName, req.body.LName, req.body.Alias, req.body.Race, req.body.HomeLocation, req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });


return router;
}();

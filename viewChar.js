module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getChars(req,res){
        var mysql = req.app.get('mysql');
        var context = {};
        mysql.pool.query("SELECT People.ID AS ID, FName, LName, Alias, Region, City, Race FROM People INNER JOIN Locations ON People.HomeLocation=Locations.id ORDER BY People.ID ASC",function(err,rows){
            if (err){
                console.log("error= ");
                console.log(err);
            } else {
                context.people = rows;
                context.jsscripts = ["deleteChar.js","filterChar.js","searchChar.js"];
                mysql.pool.query("SELECT Name, ID FROM Locations",function(err2,locs){
                    if (err2){
                        console.log(err2);
                    } else {
                        context.locations = locs;
                        res.render('viewChar',context);
                    }
                });
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
                //console.log(results[0]);
                complete();
            }
        });
    }

    function getLocs(res,mysql,context,id,complete){
        var sql = "SELECT Locations.ID AS id, name FROM Locations";
        mysql.pool.query(sql,function(err,rows){
            if (err){
                console.log(err);
            } else {
                context.locations = rows;
                complete();
            }
        });
    }

    function getCharWithNameLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT People.ID as ID, FName, LName, Alias, Region, City, Race FROM People INNER JOIN Locations ON People.HomeLocation = Locations.ID WHERE People.FName LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.people = results;
              complete();
          });
      }

    router.get('/',function(req,res){
        getChars(req,res);
    });

    function filterLocs(req,res,mysql,context,complete){
        var sql = "SELECT People.ID AS ID, FName, LName, Alias, Region, City, Race FROM People INNER JOIN Locations ON People.HomeLocation = Locations.ID WHERE Locations.ID=?";
        var insert = [ mysql.pool.escape(parseInt(req.params.f)) ];
        mysql.pool.query(sql,insert,function(err,rows){
            if (err){
                console.log(err);
            } else {
                context.people = rows;
                complete();
            }
        })
    }


    router.get('/:id', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateChar.js"];
        var mysql = req.app.get('mysql');
        getCharsForUpdate(res, mysql, context, req.params.id, complete);
        getLocs(res, mysql, context, req.params.id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('updateChar', context);
            }
        }
    });

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteChar.js","filterChar.js","searchChar.js"];
        var mysql = req.app.get('mysql');
        getCharWithNameLike(req, res, mysql, context, complete);
        getLocs(res,mysql,context,0,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('viewChar', context);
            }
        }
    });

    router.get('/filter/:f',function(req,res){
        console.log("F=" + req.params.f);
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteChar.js","filterChar.js","searchChar.js"];
        var mysql = req.app.get('mysql');
        filterLocs(req, res, mysql, context, complete);
        getLocs(res,mysql,context,0,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('viewChar', context);
            }
        }
    })


    router.put('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body);
        console.log(req.params.id);
        var sql = "UPDATE People SET FName=?, LName=?, Alias =?, Race =?, HomeLocation=? WHERE id=?";
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

    

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM People WHERE ID = ?";
        var inserts = [req.params.id];
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


return router;
}();

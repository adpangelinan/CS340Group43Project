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
            context.jsscripts = ["deleteChar.js","updateChar.js"];
            //console.log(rows[0]);
            res.render('viewLoc',context);
            }
    });
};

function getLocsForUpdate(res,mysql,context,id,complete){
    var sql = "SELECT Locations.ID AS ID, Name, City, Region,Planet FROM Locations WHERE Locations.ID = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (err, results) {
        if (err) {
            console.log("error= ");
            console.log(err);
        } else {
            context.locations = results[0];
            complete();
            }
        });
};

function dup(req,name,city,region,planet){
    var mysql = req.app.get('mysql');
    mysql.pool.query("SELECT Name FROM Locations WHERE Name=? AND City =? AND Region=? AND Planet=?",[name,city,region,planet],function(err,rows){
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

router.get('/',function(req,res){
    getLocs(req,res);
});
router.post('/', function(req, res){
    var dups = dup(req,req.body.Name,req.body.City, req.body.Region, req.body.Planet);
    if (req.body.City==="" || req.body.Region==="" || req.body.Planet==="" || req.body.Name===""){
        alert("Cannot have a blank field.");
        res.redirect('/viewLoc');
    } else if (dups){
        alert("Cannot have all fields the same as another location");
        res.redirect('/viewLoc');
    } else {
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
    }
});

router.get('/:id', function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateChar.js"];
    var mysql = req.app.get('mysql');
    getLocsForUpdate(res, mysql, context, req.params.id, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('updateLoc', context);
        }
    }


});


router.put('/:id', function (req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.body);
    console.log(req.params.id);
    var sql = "UPDATE Locations SET Name=?, City=?, Region=?,Planet=? WHERE ID=?";
    var inserts = [req.body.Name, req.body.City, req.body.Region, req.body.Planet];
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
    var sql = "DELETE FROM Locations WHERE ID = ?";
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
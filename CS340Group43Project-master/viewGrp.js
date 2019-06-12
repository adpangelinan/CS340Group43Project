module.exports = function(){
    var express = require('express');
    var router = express.Router();
function getGrps(req,res){
    var mysql = req.app.get('mysql');
    var context = {};
    mysql.pool.query("SELECT * FROM Groups",function(err,rows){
        if (err){
            console.log(err);
        } else {
            context.group = rows;
            context.jsscripts = ["deleteChar.js"];
            res.render('viewGrp',context);
            }
    });
};

function getGrpsForUpdate(res,mysql,context,id,complete){
    var sql = "SELECT Groups.ID AS ID, Name, Category, OperationalCapacity FROM Groups WHERE Groups.ID = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (err, results) {
        if (err) {
            console.log("error= ");
            console.log(err);
        } else {
            context.groups = results[0];
            complete();
            }
        });
};

function getCharByGroup (res,mysql,context,id){
    var sql = "SELECT FName, LName, Alias, Name, pepID, grpID FROM Groups INNER JOIN People_Group ON Groups.ID=grpID INNER JOIN People ON pepID=People.ID WHERE Groups.ID=?";
    var inserts = [id];
    mysql.pool.query(sql,inserts,function(err,rows){
        if (err){
            console.log (err);
        } else {
            context.data = rows;
            context.data.grpID = id;
            mysql.pool.query("SELECT Alias, ID, grpID FROM People LEFT JOIN People_Group ON ID=pepID",[id],function(err1,rows1){
                if (err1){
                    console.log(err1);
                } else {
                    var spliceArr = [];
                    var charArr = [];
                    for (var aa=0;aa<rows1.length;aa++){
                        if (rows1[aa].grpID==id){
                            spliceArr.push(rows1[aa].Alias);
                        }
                    }
                    for (var bb=0;bb<rows1.length;bb++){
                        if (spliceArr.indexOf(rows1[bb].Alias)===-1){
                            charArr.push(rows1[bb]);
                        }
                    }
                    context.people = charArr;
                    res.render('viewGrpChar',context);
                }
            })
        }
    })
}

function dup(req,name){
    var mysql = req.app.get('mysql');
    mysql.pool.query("SELECT Name FROM Groups WHERE Name=?",[name],function(err,rows){
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
    getGrps(req,res)
});
router.post('/', function(req, res){
    var dups = dup(req,req.body.name);
    if (req.body.Name===""){
        alert("Name cannot be blank.");
        res.redirect('/viewGrp');
    } else if (dups){
        alert("Cannot have the same name as another group.");
        res.redirect('/viewGrp');
    } else {
        console.log(req.body.Name);
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Groups (Name, Category,OperationalCapacity) VALUES (?,?,?)";
        var inserts = [req.body.Name, req.body.Category,req.body.OperationalCapacity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/viewGrp');
            }
        });
    }
});

router.post('/Char/',function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO People_Group (pepID, grpID) VALUES (?,?)";
    var inserts = [req.body.Alias, req.body.grpid];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewGrp');
        }
    });
})

router.get('/:id', function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateChar.js"];
    var mysql = req.app.get('mysql');
    getGrpsForUpdate(res, mysql, context, req.params.id, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('updateGrp', context);
        }
    }


});

router.get('/Char/:id',function(req,res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteChar.js"];
    var mysql = req.app.get('mysql');
    getCharByGroup(res,mysql,context,req.params.id);
})


router.put('/:id', function (req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.body);
    console.log(req.params.id);
    var sql = "UPDATE Groups SET Name=?, Category=?, OperationalCapacity=? WHERE ID=?";
    var inserts = [req.body.Name, req.body.Category, req.body.OperationalCapacity];
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
    var sql = "DELETE FROM Groups WHERE ID = ?";
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

router.delete('/Char/:pepid/:grpid',function(req,res){
    var mysql = req.app.get('mysql');
    var sql = 'DELETE FROM People_Group WHERE pepID=? AND grpID=?';
    var inserts = [req.params.pepid,req.params.grpid];
    mysql.pool.query(sql,inserts,function(err,results){
        if (err){
            console.log(err);
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            res.status(202).end();
        }
    })
})
return router;
}();
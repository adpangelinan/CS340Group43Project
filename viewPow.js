module.exports = function(){
    var express = require('express');
    var router = express.Router();
function getPows(req,res){
    var mysql = req.app.get('mysql');
    var context = {};
    mysql.pool.query("SELECT * FROM Powers",function(err,rows){
        if (err){
            console.log(err);
        } else {
            context.power = rows;
            context.jsscripts = ["deleteChar.js"];
            res.render('viewPow',context);
            }
    });
};

function getPowsForUpdate(res,mysql,context,id,complete){
    var sql = "SELECT Powers.ID AS ID, Name, Category FROM Powers WHERE Powers.ID = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (err, results) {
        if (err) {
            console.log("error= ");
            console.log(err);
        } else {
            context.powers = results[0];
            complete();
            }
        });
};

router.get('/',function(req,res){
    getPows(req,res)
});
router.post('/', function(req, res){
    console.log(req.body.Name);
    console.log(req.body);
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Powers (Name, Category) VALUES (?,?)";
    var inserts = [req.body.Name, req.body.Category];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/viewPow');
        }
    });
});

router.get('/:id', function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateChar.js"];
    var mysql = req.app.get('mysql');
    getPowsForUpdate(res, mysql, context, req.params.id, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('updatePow', context);
        }
    }


});


router.put('/:id', function (req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.body);
    console.log(req.params.id);
    var sql = "UPDATE Powers SET Name=?, Category=? WHERE ID=?";
    var inserts = [req.body.Name, req.body.Category];
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
    var sql = "DELETE FROM Powers WHERE ID = ?";
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
//var promise = require('bluebird');
//var options = {
//    promiseLib: promise
//}
var pg = require("pg");
//var pgpromise = require('pg-promise')(options);
//var connectString = 'postgres://postgres:postgres@202.1.39.171/trial-unicrime';
//var db = pgp(connectString);
var express = require('express'); // require Express
var router = express.Router(); // setup usage of the Express router engine

/* PostgreSQL and PostGIS module and connection setup */
//

//var conString = "postgres://postgres:postgres@202.1.39.171/cambridge"; // Your Database Connection
var conString = "postgres://postgres:postgres@202.1.39.171/trial-unicrime";
//var db = pgp(conString);
//where there are conStrings, I added db;
// Set up your database query to display GeoJSON
var coffee_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, name)) As properties FROM coffee_shops As lg) As f) As fc";
var crime_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((gid,crime_type)) As properties FROM public As lg) As f) As fc";
var buildings_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((gid,name)) As properties FROM uni_buildings As lg) As f) As fc";
var roads_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((gid,road_name)) As properties FROM roads As lg) As f) As fc";
//var crime_insert="INSERT INTO public (geom, crime_type,street,latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Point","coordinates":[ {longitude value},{latitude value} ]}'),4326),'{crime_type value}','{street value}','{longitude value}','{latitude value}')";
//INSERT INTO public (geom, crime_type,street,latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Point","coordinates":[ 8.88,8.88]}'),4326),'vandalism','mumeng Dr','8.88','8.88')
var geo_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.where_is)::json As geometry, row_to_json((id,crime_type)) As properties FROM crimes As lg) As f) As fc";

//insert queries
//var geom_insert=;
//var geomt="(ST_SetSRID(ST_GeomFromGeoJSON('{'type':'Point','coordinates':[$3,$4]}'),4326))";
//var crime_insert="INSERT INTO public(geom,crime_type,street,latitude,longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('ST_SetSRID(ST_GeomFromGeoJSON({'type':'Point','coordinates:[$4,$5]'},$2,$3,$4,$5)";
var crime_insert='INSERT INTO public (geom, crime_type,street,latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":"Point","coordinates":[$4,$5]}\'),4326),$2,$3,$4,$5)';
//var sql = "INSERT INTO data_collector (the_geom, description, name, latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('";
//var a = layer.getLatLng();
//var crime_insert2 ='{"type":"Point","coordinates":[$4,$5]}),4326),"$3,$4,$5)';

//var crime_insert=crime_insert1 + crime_insert2;


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;

/* GET Postgres JSON data */
router.get('/crime', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(crime_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});


/* tesst2 crime data-geography */
router.get('/crimes', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(geo_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});


//

/* GET Postgres JSON building */
router.get('/buildings', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(buildings_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});


/* GET Postgres JSON streets */
router.get('/roads', function (req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(roads_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});

/* GET the map page */
router.get('/map', function(req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(buildings_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        var data = result.rows[0].row_to_json
        res.render('map', {
            title: "Express API",
            jsonData: data
        });
    });
});

/**
 * function setData() {
    var enteredUsername = username.value;
    var enteredDescription = description.value;
    drawnItems.eachLayer(function (layer) {
        var sql = "INSERT INTO data_collector (the_geom, description, name, latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('";
        var a = layer.getLatLng();
        var sql2 ='{"type":"Point","coordinates":[' + a.lng + "," + a.lat + "]}'),4326),'" + enteredDescription + "','" + enteredUsername + "','" + a.lat + "','" + a.lng +"')";
        var pURL = sql+sql2;
        submitToProxy(pURL);
        console.log("Feature has been submitted to the Proxy");
    });
    map.removeLayer(drawnItems);
    drawnItems = new L.FeatureGroup();
    console.log("drawnItems has been cleared");
    dialog.dialog("close");
};
 */
/* post data to app*/
router.post('/crime', function(req, res) {
    var client = new pg.Client(conString);
    client.connect();
    const {geom,crime_type,street,latitude,longitude}=req.body;

    var query = client.query(crime_insert,[geom,crime_type,street,latitude,longitude],error=>{
     if(error){
         throw error
     } else{
        res.status(201).json({ status: 'success', message: 'Crime data added.' });  
     }  
    })

});

//test post
function plotCrimePoint(req, res, next) {
    db.none('insert into public (crime_type,street,latitude,longitude) values(${crime_type},${street},${latitude},${longitude})', req.body)
        .then(() => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'retrieved add a student'
                });
        })
        .catch((err) => {
            console.log(err);
            return next(err);
        });
}





/* post data to app*/
router.put('/crimegeom', function(req, res) {
    var client = new pg.Client(conString);
    client.connect();
    const {geom,crime_type,street,latitude,longitude}=req.body;
    var query = client.query(crime_insert,[geom,crime_type,street,latitude,longitude],error=>{
     if(error){
         throw error
     } else{
        res.status(201).json({ status: 'success', message: 'Crime data added.' });  
     }  
    })

});



/* delete */
router.delete('/:id/delete', function(req, res) {
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(buildings_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        var data = result.rows[0].row_to_json
        res.render('map', {
            title: "Express API",
            jsonData: data
        });
    });
});


/* GET the filtered page */
router.get('/filter*', function (req, res) {
    var name = req.query.name;
    if (name.indexOf("--") > -1 || name.indexOf("'") > -1 || name.indexOf(";") > -1 || name.indexOf("/*") > -1 || name.indexOf("xp_") > -1){
        console.log("Bad request detected");
        res.redirect('/map');
        return;
    } else {
        console.log("Request passed")
        var filter_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, name)) As properties FROM coffee_shops As lg WHERE lg.name = \'" + name + "\') As f) As fc";
        var client = new pg.Client(conString);
        client.connect();
        var query = client.query(filter_query);
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            var data = result.rows[0].row_to_json
            res.render('map', {
                title: "Express API",
                jsonData: data
            });
        });
    };
});



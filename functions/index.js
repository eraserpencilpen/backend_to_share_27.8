const path = require('path');
const express = require('express');
const { verifyToken } = require('../path/to/serviceAccountKey.json');
const admin = require('firebase-admin');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
foo = {origin: 
    ['https://66cd85e86d1510ac55cfd237--eloquent-klepon-2c098a.netlify.app','https://66cd766488b5ca9bfcb43aaf--fascinating-bunny-bdd323.netlify.app/'],
    default:"https://66cd85e86d1510ac55cfd237--eloquent-klepon-2c098a.netlify.app"}



app.use(cors());

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(bodyParser.json());

//=================================================================================================================
//=================================================================================================================
//=================================================================================================================
// basically this is just the root directory 
// important for routing
// do not delete
// replace contents if necessary

app.get("/",(req,res)=>{
    res.send("Hello. this is working!")
    // do not remove, this is root directory
    // without it ???
    // ???
    // IDK What will happen but don't you dare
})


// critical component
// used to initiate the express.js server
// tells the server to listen to http requests
// if PORT not specified, default is 8080

app.listen(PORT, '0.0.0.0', () => {
    // logs on to the debug or output pannel to show that the express.js is listening to this specific port
    console.log(`Server is running on port ${PORT}`);
});



//=================================================================================================================
//=================================================================================================================
//=================================================================================================================

// USED IN PAGE 7
// GET API CALL FROM THE FRONT END
// SERVER OR BACKEND THEN QUERIES THE DATABASE FOR ALL THE INVENTORY DATA
// AND SENDS IT IN JSON FORM TO THE FRONT END
// THE FRONT END WILL THEN PROCESS IT, AND THEN DISPLAY THE INVENTORY DATA TO THE USER

//=================================================================================================================

// this API call works
// THE API CALL
// this API is in use
// do not remove
// last edited with pagination & cdn capabilities
// by yusuf & aura 
// AUGUST 27th 2024 : 14:22

app.get('/inventory', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    getInventoryData(page, pageSize, (err, data) => {
        if (err) {
            res.status(500).send('Error retrieving inventory data');
        } else {
            res.json(data);
        }
    });
});
// Function to get paginated inventory data
function getInventoryData(page, pageSize, callback) {
    const scriptDir = __dirname;
    const dbPath = path.join(scriptDir, 'new_data.db');

    const db = new sqlite3.Database(dbPath);

    const offset = (page - 1) * pageSize;
    const sql = `SELECT goods_name, goods_image, goods_quantity, goods_price, goods_type FROM inventory LIMIT ? OFFSET ?`;

    db.all(sql, [pageSize, offset], (err, rows) => {
        if (err) {
            console.error(`Error fetching data: ${err}`);
            callback(err, null);
        } else {
            callback(null, rows);
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error fetching data: ${err}');
                    callback(err, null);
                } else {
                    // Convert image BLOBs to base64 strings for JSON representation
                    const formattedRows = rows.map(row => ({
                        goods_name: row.goods_name,
                        goods_image: row.goods_image ? row.goods_image.toString('base64') : null,
                        goods_quantity: row.goods_quantity,
                        goods_price: row.goods_price,
                        goods_type: row.goods_type
                    }));
                    callback(null, formattedRows);
                }
        
                db.close();
            });
        }

        db.close();
    });
}

// 
// real life issues: too much data,
//                   sessions cannot commit
//
// split it, implement paging

//=================================================================================================================
//=================================================================================================================
//=================================================================================================================

// USED IN PAGE 8
// GET API CALL FROM THE FRONT-END
// SERVER OR BACKEND THEN QUERIES THE DATABASE FOR ALL THE ORDER INFORMATION
// THE DATA IS THEN SENT TO THE FRONT-END
//  THE DATA IS FORMATTED, BEFORE DISPLAYING ON TO THE SCREEN TO USERS

//=================================================================================================================

// this one is in use
// urgently warned do not remove
// Function to get data from the database
function getOrderData(callback) {
    const scriptDir = __dirname;
    const dbPath = path.join(scriptDir, 'new_data.db');
    const db = new sqlite3.Database(dbPath);

    const selectQuery = `
        SELECT id, goods_name, goods_quantity, goods_price, order_date
        FROM orders
    `;
    
    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });

    db.close();
}

// this API works
// this is inuse
// strongly do not remove
// API endpoint to get orders data
app.get('/orders', (req, res) => {
    getOrderData((err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve data' });
        }
        res.json(data);
    });
});

//=================================================================================================================
//=================================================================================================================
//=================================================================================================================

// USED IN PAGE 9
// GET API CALL FROM THE FR0NT END
// RETRIEVES THE USER SELECTED REGION
// PASSES IT TO THE NEXT API
// TRIGGERS A POST API TO THE NEXT PAGE THAT CORRESPONDS TO THE SELECTED REGION
// A DATABASE QUERY WILL RETRIEVE DATA ON FARMERS THAT ARE LOCATED ON THAT REGION, AND DISPLAY IT TO THE USER
// DATA COLLECTED IS COORDINATES LATTITUDE & LONGTITUDE

//=================================================================================================================

// THE API CALL

// modified api call for the map page:
// in use
// is in use
// do not remove under any circumstances

app.get('/viewmapfarmer', (req, res) => {
    const locationText = req.query.location; // Location choice from the frontend

    if (!['MACHANG', 'CAMERON HIGHLANDS', 'BESUT'].includes(locationText)) {
        return res.status(400).json({ error: 'Invalid location' });
    }

    const scriptDir = __dirname;
    const dbPath = path.join(scriptDir, 'new_data.db');
    const db = new sqlite3.Database(dbPath);

    const selectQuery = `
        SELECT latitude, longitude
        FROM farmer
        WHERE location_text = ?;
    `;

    db.all(selectQuery, [locationText], (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Send the retrieved data as JSON
        res.json(rows);
    });

    db.close();
});

//=================================================================================================================
//=================================================================================================================
//=================================================================================================================

// USED IN PAGE 11
// GET API CALL FROM THE FRONT END
// AS THE USER HAS SELECTED A REGION
// AND THE REGIONS'S FARMER COORDINATES HAVE BEEN USED
// THE FARMER'S FARM DISTANCE RELATIVE TO THE USER WILL BE CALCULATED
// AND BE USED TO SORT THEM RELATIVE TO THE USER


//=================================================================================================================

// customer home page where they can view farmer profiles
// in use
// slightly do not remove
// critically important

app.get('/farmer', (req, res) => {
    const locationText = req.query.location_text;
    const scriptDir = __dirname;
    const dbPath = path.join(scriptDir, 'new_data.db');
    const db = new sqlite3.Database(dbPath);

    const selectQuery = `
        SELECT name, rating, profile_image, latitude, longitude, location_text FROM farmer
        WHERE location_text = ?;
    `;

    db.all(selectQuery, [locationText], (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
            const formattedRows = rows.map(row => ({
                name: row.name,
                rating: row.rating,
                profile_image: row.profile_image ? row.profile_image.toString('base64') : null,
                latitude: row.latitude,
                longitude: row.longitude,
                location_text: row.location_text
            }));
            res.json(formattedRows);
        }
        db.close();
    });
});

//=================================================================================================================
//=================================================================================================================
//=================================================================================================================


// PAGE 13
// POST API FROM THE FRONT END
// SERVER RECEIVES JSON DATA, AND INSERTS IT INTO THE DATABASE
// CALL MADE BY USING THE URL : /insertorders

//=================================================================================================================

// THE POST API CALL
// THE POST API CALL
// critically in use
// under any circumstance do not remove

function insertOrder(goodsName, goodsQuantity, goodsPrice, orderDate, callback) {
    console.log('Starting database insertion process...');
    const db = new sqlite3.Database('./new_data.db', (err) => {
        if (err) {
            console.error('Failed to connect to the database:', err.message);
            return callback(err, null);
        }
        console.log('Connected to the database.');
    });
    
    const insertQuery = `
        INSERT INTO orders (goods_name, goods_quantity, goods_price, order_date)
        VALUES (?, ?, ?, ?)
    `;
    
    db.run(insertQuery, [goodsName, goodsQuantity, goodsPrice, orderDate], function(err) {
        if (err) {
            console.error('Failed to insert data into orders table:', err.message);
            return callback(err, null);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        callback(null, { message: 'Order inserted successfully', orderId: this.lastID });
    });

    db.close((err) => {
        if (err) {
            console.error('Failed to close the database connection:', err.message);
        } else {
            console.log('Database connection closed successfully.');
        }
    });
}

// in use
// critically important
// do not remove

app.post('/insertorders', (req, res) => {
    console.log('Received POST request to /insertorders with body:', req.body);
    const { goodsName, goodsQuantity, goodsPrice, orderDate } = req.body;
    
    // Check for missing required fields
    if (!goodsName || !goodsQuantity || !goodsPrice || !orderDate) {
        console.error('Validation error: Missing required fields');
        return res.status(400).json({ error: 'Please provide all required fields: goodsName, goodsQuantity, goodsPrice, orderDate' });
    }

    insertOrder(goodsName, goodsQuantity, goodsPrice, orderDate, (err, result) => {
        if (err) {
            console.error('Error in insertOrder callback:', err.message);
            return res.status(500).json({ error: 'Failed to insert order', details: err.message });
        }
        console.log('Order insertion successful:', result);
        res.status(201).json(result);
    });
});


//=================================================================================================================
//=================================================================================================================
//=================================================================================================================

// The receont most page
// use to delete orders 

//=================================================================================================================


// the delete order function
// to be used on the farmer manage order page:
function deleteOrder(orderId, callback) {
    console.log('Starting database deletion process...');
    const db = new sqlite3.Database('./new_data.db', (err) => {
        if (err) {
            console.error('Failed to connect to the database:', err.message);
            return callback(err, null);
        }
        console.log('Connected to the database.');
    });
    
    const deleteQuery = `
        DELETE FROM orders WHERE id = ?
    `;
    
    db.run(deleteQuery, [orderId], function(err) {
        if (err) {
            console.error('Failed to delete order from orders table:', err.message);
            return callback(err, null);
        }
        if (this.changes > 0) {
            console.log(`Order with id ${orderId} has been deleted`);
            callback(null, { message: 'Order deleted successfully' });
        } else {
            console.log(`No order found with id ${orderId}`);
            callback(null, { message: 'No order found with the given ID' });
        }
    });

    db.close((err) => {
        if (err) {
            console.error('Failed to close the database connection:', err.message);
        } else {
            console.log('Database connection closed successfully.');
        }
    });
}


// the api call corresponding to the delete
// will be used on the FarmerManageOrderPage

app.delete('/deleteorder/:id', (req, res) => {
    console.log('Received DELETE request to /deleteorder with id:', req.params.id);
    const orderId = req.params.id;

    // Validate that an ID was provided
    if (!orderId) {
        console.error('Validation error: Missing order ID');
        return res.status(400).json({ error: 'Please provide a valid order ID' });
    }

    deleteOrder(orderId, (err, result) => {
        if (err) {
            console.error('Error in deleteOrder callback:', err.message);
            return res.status(500).json({ error: 'Failed to delete order', details: err.message });
        }
        console.log('Order deletion result:', result);
        res.status(200).json(result);
    });
});

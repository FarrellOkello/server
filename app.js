const express = require('express');
const http = require('http');
const itemsRouter = require('./routes/items')
const bodyParser = require('body-parser');
const morgan = require('morgan');const pg = require('pg')
const app = express();


//the config code block that connects to the postgres DB
let pool  = new pg.Pool(
    {
        host:'127.0.0.1',
        user:'postgres',
        database: "bookstore",
        port:5400,
        password:'12345678=j',
        max:10,       
        
    }
);

app.use(express.json());


app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(function (request, response, next)  
    {
        response.header("Access-Control-Allow-Origin","*");
        response.header("Access-Control-Allow-Header","Origin, X-requested-With, Content-Type, Accept");
        next();
})

//api pulling the books from the postgres DB
app.get('/api/books',function(request,response){
    pool.connect(function(err,db,done){
        if(err){
           return response.status(400).send(err); 
        }
        else{
            db.query('SELECT * FROM books', function(err,table){
                done();
                if(err){
                    response.status(400).send(err)
                }else{
                     response.status(200).send(table.rows)
                }
            })
        }
    })
})

//THIS IS API CODE BLOCK TO ADD BOOK TO BOOKSTORE TABLE IN POSTGREE

app.post('/api/new-book', function(request, response){
    var name = request.body.name;
    var genre = request.body.genre;
    var author = request.body.genre;
    let values = [name, genre, author];
        console.log(values);
 pool.connect((err,db, done)=>{
    if(err){
        console.log(err);
    }else{
        db.query('INSERT INTO books(name, genre, author) VALUES ($1, $2, $3)',[...values] ,
         (err, table)=>{
            if(err){
                return console.log(err);
            }else{
                return console.log('Data inserted:');
                response.status(201).send({message:'Data inserted inside db'});
            }
        })
    }
});
});

//API TO PULL SINGLE BOOK FROM DB
app.get('/api/book/:id', function(request, response){
    var id = request.params.id;
    console.log(id);
    pool.connect(function(err, db, done){
        if(err){
            response.status(400).send(err)
        }else{
            db.query('SELECT * countries WHERE "id" = $1',[Number(id)], function(err,result){
            //   done();
                if(err){
                    return response.status(400).send(err)
                }else{
                    return response.status(200).send({message:'Deleted successfully!'})
                }
            });
        }
    })
})


//cross origin resourses
const cors = require('cors')
app.use(cors());




app.listen(4000, ()=>{
    console.log('now listening for requests on port 4000');
    console.error();
})

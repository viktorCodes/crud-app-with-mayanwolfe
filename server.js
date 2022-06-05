console.log('May Node be with you')

const express = require ('express')
const bodyParser = require ('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://viktorcodes:marthbes_1@cluster0.qj8rt.mongodb.net/?retryWrites=true&w=majority'

/*MongoClient.connect(connectionString, (err, client) => {
    if(err) return console.err(err)
    console.log('Connected to Database')
}) */

//another modern version of the code directly above

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')
    
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    //READ
    app.get('/', (request, response) => {
       quotesCollection.find().toArray()
           .then(results => {
              // console.log(results)
               response.render('index.ejs', {quotes: results})
           })
           .catch(error => console.error(error))
  //console.log(cursor)
        
    })

    //CREATE
    app.post('/quotes', (request, response) => {
        quotesCollection.insertOne(request.body)
    .then(result => {
     // console.log(result)
      response.redirect('/')
    })
    .catch(error => console.error(error))
    })

    //UPDATE
    app.put('/quotes', (request, response) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
           {   $set: {
            name: request.body.name,
            quote: request.body.quote
          }  } ,
           {
               upsert: true
            } 
          )
            .then(result => {
                console.log(result)
                response.json('Success')
            })
            .catch(error => console.error(error))
      })

    //DELETE
      app.delete('/quotes', (request, response) => {
        quotesCollection.deleteOne(
          {name: request.body.name}
        )
        .then(result => {
            
                if (result.deletedCount === 0) {
                  return response.json('No quote to delete')
                } 
            response.json("Deleted Darth Vader's quote")
          })
          .catch(error => console.error(error))
      })

    app.listen(3000, function(){
        console.log('listening on 3000')
    })

  })
  .catch(error => console.error(error))








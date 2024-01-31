const express=require('express')
const app=express()

const bodyparser=require('body-parser')
app.use(express.static(__dirname))
app.use(bodyparser.json())

const {connectToDb,getDb}=require('./db.cjs')

const {ObjectId}=require('mongodb')

let db
//connect to dbm
connectToDb( function(error){
   if(!error){
   //start the server
   app.listen(8000)
   console.log("server lIsten on port 8000....")

   db=getDb() // connection establisg panni store panni vaichathu
   }
   else{
      console.log(error)
   }
})

app.post('/expense-datas',function(request,response){
   /**   const {category,amount,date}=request.body
   //   console.log("Received Data:",{category,amount,date})
   //   response.status(200).json({
   //      'message':"expense added",
   //      data:{category,amount,date}
   / }) */

   //console.log(request.body)   // what to insert is there

   db.collection('ExpenseData').insertOne(request.body).then(function(){
      response.status(201).json({
           "status":"Entries added"
      })// entry add to db and with added successfull msg
   }).catch(function(error){
      response.json(200).json({
         'error':error
      })

   })

}) 


// app.get('/get-data',function(request,response){
//    const entries=[]
//    db.collection('ExpenseData').find().forEach(entry=>entries.push(entry)).then(function(){
//          response.status(200).json(entries)
//    }).catch(function(error){
//       response.status(404).json({
//          'error':error
//       })
//    })

// })



app.get('/get-data', async function(request, response) {
   try {
       let query = {};
       if (request.query.category) {
           query = { category: request.query.category };
           console.log('Query parameter received:', request.query.category);
       }

       const result = await db.collection('ExpenseData').find(query).toArray();
       response.status(200).json(result);
   } catch (error) {
       response.status(500).json({
           'error': error.message
       });
   }
});




app.delete('/delete-data',function(request,response){
   db.collection('ExpenseData').deleteOne({
      _id:new ObjectId(request.body.id)
   }).then(function(){
      response.status(200).json({
         "response status":"successfully deleted"
      })
   }).catch(function(error){
      response.status(500).json({
         'error' : error
   })
})
})

app.patch('/update-entry', function(request, response) {
   if(ObjectId.isValid(request.body.id)) {
       db.collection('ExpenseData').updateOne(
           {_id: new ObjectId(request.body.id)},
           {$set : request.body.data}
       ).then(function() {
           response.status(201).json({
               'status' : 'data successfully updated'
           })
       }).catch(function(error) {
           response.status(500).json({
               'error' : error
           })
       })
   } else {
       response.status(500).json({
           'status' : 'ObjectId not valid'
       })
   }
})



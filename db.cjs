const {MongoClient}=require('mongodb') 

let db
function connectToDb(startServer){
    db=MongoClient.connect('mongodb+srv://shanksankari:shank@cluster0.owftoom.mongodb.net/expenseTracer?retryWrites=true&w=majority').then(function(client) // which database we connect with my database Name
    {
    
    db=client.db()
    return startServer()

}).catch(function(error){
      return startServer(error)
})
}
function getDb(){
   return db
}
module.exports={connectToDb,getDb}




/**end point
 * get entries- fetch the data
 * 
 */
const {MongoClient} = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
console.log("MONGO URI:", process.env.MONGO_URI);

let database;
const connectDB = async () => {
    try{
        await client.connect();
        console.log("Connect to MongoDB");
        database = client.db(process.env.DB_NAME);
        database.collection("users").createIndex({email: 1}, {unique: true});
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
}
const getDB = () => database;

module.exports = {connectDB, getDB};
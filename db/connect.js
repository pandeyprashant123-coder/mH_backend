import mongoose from 'mongoose'
import Pusher from 'pusher'

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
mongoose.set('strictQuery', false);
export default connectDB

const pusher = new Pusher({
  appId: "1555646",
  key: "1bfa9688581b43fd6376",
  secret: "711361d78b66e02307b2",
  cluster: "ap2",
  useTLS: true
});


const db = mongoose.connection
db.once("open",()=>{
  console.log('DB connected')

  const msgCollection = db.collection("messagecontents")
  const changeStream = msgCollection.watch()
  changeStream.on('change',(change)=>{
    // console.log(change)
    if (change.operationType ==='insert') {
      const messageDetails = change.fullDocument;
      pusher.trigger('messages','inserted',{
        name:messageDetails.name,
        message:messageDetails.message,
        timestamp:messageDetails.timestamp,
        received:messageDetails.received
      })
    }
    else{
      console.log("Error pushing trigger")
    }
  })
})

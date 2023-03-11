import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from'dotenv'

import connectDB from './db/connect.js'
import Messages from './models/message.js'

dotenv.config()

const app = express();


app.use(bodyParser.json({limit:'30mb',extended: true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended: true}))
app.use(cors())



app.get('/messages/sync',async (req,res)=>{
  try {
    const Message = await Messages.find();
    res.status(200).json(Message);
  } catch (error) {
    res.status(404).json({msg:error})
  }
})
app.post('/messages/new',async (req,res)=>{
  const dbMessages = req.body;
  const newMessage = new Messages({...dbMessages,timestamp:new Date().toISOString()});
  try {
    await newMessage.save()
    res.status(201).json(newMessage)
  } catch (error) {
    res.status(404).json({msg:error})
  }
})



const port = process.env.PORT || 5000;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
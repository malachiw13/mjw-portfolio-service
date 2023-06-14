import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import { Mongoose } from 'mongoose'
import AWS = require("aws-sdk");

const mongoose = new Mongoose()
mongoose.connect('')
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  Id: { type: String, required: true},
  name: String,
  emails: [String],
  phones: [String],
  sections: [{
    header: String,
    topics: [{
      title: String,
      subTitle: String,
      points: [String]
    }]
  }]
});

const portfolioData = mongoose.model('portfolio', portfolioSchema)

AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send(`hello from, ${JSON.stringify(req.body)}` + req)
})

app.get('/AWS/:userId', (req: Request, res: Response) => {
  docClient.get({TableName: "portfolios", Key: {"Id": req.params.userId}}, (err: any, data: any) => {
    if(err) {
      res.send(err);
    } else{
      res.send(JSON.stringify(data?.Item))
    }
  })
})

app.get('/mongoose/:userId', (req: Request, res: Response) => {
  portfolioData.find({ Id: req.params.userId }).then(x => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(x))
  })
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
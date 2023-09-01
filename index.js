const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require("./models/User");

// client에서 오는 정보를 분석해서 가져옴
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extanded: true}));
// application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  // .connect("mongodb+srv://yoo128:1234@cluster0.yj7sq9q.mongodb.net/?retryWrites=true&w=majority")
  .connect(config.mongoURL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello Worlds!')
})

app.post('/register',(req,res)=>{   
  //회원가입할 때 필요한 정보들을 client에서 가져오면,
  //그 정보들을 DB에 넣어준다.
  const user = new User(req.body);
  //user모델에 정보가 저장됨
  //실패 시, 실패한 정보를 보내줌
  user.save().then(()=>{
      res.status(200).json({
          success:true
      })
  }).catch((err)=>{
      return res.json({success:false,err})
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
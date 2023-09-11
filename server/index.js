const express = require('express')
const app = express()
// const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// client에서 오는 정보를 분석해서 가져옴
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello Worlds!')
})

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요! 성공했네요!");
})

app.post('/api/register',(req, res)=>{   
  //회원가입할 때 필요한 정보들을 client에서 가져오면,
  //그 정보들을 DB에 넣어준다.
  const user = new User(req.body);
  //user모델에 정보가 저장됨
  //실패 시, 실패한 정보를 보내줌
  user.save().then(()=>{
      res.status(200).json({
          success: true
      })
  }).catch((err)=>{
      return res.json({success: false, err})
  });
})

app.post('/api/login', (req, res) => {
  // 요청된 이메일을 데이터베이서 있는지 찾는다
  User.findOne({ email: req.body.email })
    .then((user) => {
      if(!user){
        return res.json({
          loginSuccess: false,
          messsage: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }

      // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch)
          return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      })

      // 비밀번호까지 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, ...
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      })
    })
    .catch((err) => {
      return res.status(400).send(err);
    })
})

app.get('/api/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는
  // Authentication이 True라는 말
  res.status(200).json({
    _id: req.user._id,
    // 0이면 일반유저, 0이 아니면 관리자~
    isAdmin: req.user.role === 0 ? false: true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/logout', auth, (req, res) => {
  // User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
  //   .then((user) => {
  //     // if (!user) {
  //     //   return res.json({ success: false, message: "User not found" });
  //     // }
  //     return res.status(200).send({
  //       success: true,
  //       // message: "Logout successful",
  //     });
  //   })
  //   .catch((err) => {
  //     // return res.status(500).json({ success: false, error: err.message });
  //     return res.json({ success: false, err });
  //   });
  // 2️⃣
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((user) => {
        return res.status(200).send({
            success: true
          })
        })
        .catch((err) => res.json({ success: false, err }))
  // 1️⃣
  // User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
  //   if(err) return res.json({ success: false, err });
  //   return res.status(200).send({
  //     success: true
  //   })
  // })
})

const port = 5000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
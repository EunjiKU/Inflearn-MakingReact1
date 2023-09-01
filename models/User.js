const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    // 빈칸 삭제 yoo 1 28@naver.com 같은...
    trim: true,
    // 똑같은 이메일 못쓰게
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname : {
    type: String,
    maxlength: 50
  },
  // 관리자와 일반유저 구분
  role: {
    type: Number,
    // 0이면 일반유저, 1이면 관리자~
    default: 0
  },
  image: String,
  // 유효성 관리
  token: {
    type: String
  },
  // token을 사용할 수 있는 유효기간 설정
  tokenExp: {
    type: Number
  }
})

const User = mongoose.model('User', userSchema);

module.exports = { User }
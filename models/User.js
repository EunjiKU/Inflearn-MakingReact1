const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

userSchema.pre('save', function( next ) {
  var user = this;

  // 비밀번호를 암호화 시킨다.
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if(err) return next(err)
    
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err)
      user.password = hash
    });
  });

  next();
})

const User = mongoose.model('User', userSchema);

module.exports = { User }
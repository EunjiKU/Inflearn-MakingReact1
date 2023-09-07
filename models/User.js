const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

  if(user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)
      
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      });
    });
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
  // [plainPassword]랑 [암호화된 비밀번호] 같은 지 비교!!!
  // [plainPassword]도 암호화!!!
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err),
      cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function(cb) {
  var user = this;

  // jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  // user._id + 'secretToken' = token
  // token을 해석할 때, 'secretToken'을 넣으면 user._id가 나온다.
  // 그래서 token을 가지고 누구인지 알 수 있다.
  // 'secretToken' -> user._id

  user.token = token
  user.save().then(() => {
    cb(null, user)
  }).catch((err) => {
    return cb(err)
  })
}

userSchema.methods.findByToken = function(token, cb) {
  var user = this;

  // 토큰을 decode한다.
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ "_id": decoded, "token": token })
      .then((user) => {
        cb(null, user);
      })
      .catch((err) => {
        return cb(err);
      })
    // user.findOne({ "_id": decoded, "token": token }, function(err, user) {
    //   if(err) return cb(err);
    //   cb(null, user);
    // })
  })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }
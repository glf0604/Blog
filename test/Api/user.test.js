// user.test.js
const request = require('superagent')
const expect = require('chai').expect

let api_fix = 'http://localhost:8888/api'

describe('test /user/regirrst', function() {
  // 用户注册功能
  it('Username cannot null', function(done) {
    request
      .post(api_fix + '/user/register')
      .type('form')
      .send({
        username: ''
      })
      .end(function(err, res) {
        expect(res.body.code).to.be.equal(1)
        done()
      })
  })
  it('Password cannot null!', function(done) {
    request
      .post(api_fix + '/user/register')
      .type('form')
      .send({
        username: 'test',
        password: '',
        repassword: ''
      })
      .end(function(err, res) {
        expect(res.body.code).to.be.equal(2)
        done()
      })
  })
  it('The two passwords did not match', function(done) {
    request
      .post(api_fix + '/user/register')
      .type('form')
      .send({
        username: 'test',
        password: '123',
        repassword: '123123'
      })
      .end(function(err, res) {
        expect(res.body.code).to.be.equal(3)
        done()
      })
  })
  it('Username has been registered', function(done) {
    request
      .post(api_fix + '/user/register')
      .type('form')
      .send({
        username: 'admin',
        password: 'admin',
        repassword: 'admin'
      })
      .end(function(err, res) {
        expect(res.body.code).to.be.equal(4)
        done()
      })
  })
  it('Registered successfully', function(done) {
    request
      .post(api_fix + '/user/register')
      .type('form')
      .send({
        username: 'test_' + parseInt(Math.random() * 10000),
        password: '123456',
        repassword: '123456'
      })
      .end(function(err, res) {
        expect(res.body.message).to.be.equal('Registered successfully')
        done()
      })
  })
})
describe('test /user/login', function() {
  // 登录功能
  it('Username or Password cannot null!', function(done) {
    request
      .post(api_fix + '/user/login')
      .type('form')
      .send({
        username: '',
        password: ''
      })
      .end(function(err, res) {
        expect(res.body.code).to.be.equal(1)
        done()
      })
  })
  it('Username or Password Error!', function(done) {
    request
      .post(api_fix + '/user/login')
      .type('form')
      .send({
        username: 'test',
        password: '1'
      })
      .end(function(err, res) {
        expect(res.body.code).to.be.equal(2)
        done()
      })
  })
  it('Login Successful!', function(done) {
    request
      .post(api_fix + '/user/login')
      .type('form')
      .send({
        username: 'admin',
        password: 'admin'
      })
      .end(function(err, res) {
        expect(res.body.message).to.be.equal('Login Successful!!')
        done()
      })
  })
})

// req.cookies.set(
//   'userInfo',
//   JSON.stringify({
//     _id: userInfo._id,
//     username: userInfo.username
//   })
// )

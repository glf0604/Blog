var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Cookies = require('cookies')

var expressWs = require('express-ws')
var app = express()

var User = require('./models/User')

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    port: 3000 //监听接口
    // verifyClient: socketVerify //可选，验证连接函数
  })

//广播
wss.broadcast = function broadcast(s, ws) {
  // console.log(ws);
  // debugger;
  wss.clients.forEach(function each(client) {
    // if (typeof client.user != "undefined") {
    if (s == 1) {
      // client.send(ws.user + ":" + ws.msg);
      client.send(ws.content)
    }
    if (s == 0) {
      client.send(ws + 'Exit')
    }
    // }
  })
}

// 初始化
wss.on('connection', function(ws) {
  // console.log(ws.clients.session);
  // console.log(wss.clients);
  // console.log("在线人数", wss.clients.length);
  // ws.send('你是第' + wss.clients.length + '位');
  // 发送消息
  ws.on('message', function(jsonStr, flags) {
    console.log(jsonStr)
    var obj = eval('(' + jsonStr + ')')
    this.user = obj
    if (typeof this.user.msg != 'undefined') {
      if (this.user.msg == 'login') {
        wss.broadcast(1, obj)
      } else if (this.user.msg == 'comment') {
      }
    }
  })
  // 退出聊天
  ws.on('close', function(close) {
    try {
      wss.broadcast(0, this.user.name)
    } catch (e) {
      console.log('Refresh')
    }
  })
})
// expressWs(app);

// app.ws('/socketTest', function (ws, req){
//     ws.send('你连接成功了')
//     ws.on('message', function (msg) {
//         console.log(msg)
//         console.log(ws)
//         // 业务代码
//         //判断用户
//         //提醒原作者
//          expressWs.clients.forEach(function each(client) {
//              client.send(ws.name + ":" + ws.msg);
//          })
//     })
// })

app.use('/public', express.static(__dirname + '/public'))

app.engine('html', swig.renderFile)
app.set('views', './views')
app.set('view engine', 'html')
swig.setDefaults({ cache: false })

app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  req.cookies = new Cookies(req, res)
  req.userInfo = {}
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
      User.findById(req.userInfo._id).then(function(userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })
    } catch (e) {
      next()
    }
  } else {
    next()
  }
})

app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

/*var io = require('socket.io');
// var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
});*/

/*app.get('/main.css',function (req,res,next) {
    res.setHeader('content-type','text/css');
    res.send('body {background: red;}');
})*/

// mongoose.connect('mongodb://localhost:27019/blog',{useNewUrlParser:true,useUnifiedTopology: true},function (err) {
mongoose.connect('mongodb://localhost:27019/blog', { useNewUrlParser: true, useUnifiedTopology: true }, function(
  err
) {
  if (err) {
    console.log('Fail')
  } else {
    app.listen(8888)
    console.info('mongodb connect successful')
    console.log('Listen at http//:localhost:8888')
  }
})

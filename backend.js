const express = require('express')
// Express 모듈을 실행해 app 변수에 할당. 익스프레스 내부에 http 모듈이 내장되어 있어 서버 역할.
const app = express()

// socket.io setup
const http = require('http')
const server = http.createServer(app)

const { Server } = require("socket.io");
// FE는 BE에게 2초마다 을 보내야만함. 만약 BE가 유효한 응답을 5초동안 받지 못하면 disconnect 호출
const io = new Server(server, {pingInterval: 2000, pingTimeout: 5000});

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  // res.send : 일반 문자열 전송
  // res.sendFile : HTML 응답.
  res.sendFile(__dirname + '/index.html')
})

// 배열 말고 객체 씀. 플레이어 추가 삭제에 성능 좋음.
// 배열은 삽입 삭제시 모든걸 탐색.
// 객체는 즉시 삭제 추가 가능. 게임이 정말 복잡해질 경우를 대비하여 게임 속도를 높이기 위해
// 약간의 보너스 추가 가능.
const backEndPlayers ={

}


// FE와 연결 시도 
io.on('connection', (socket)=>{
  console.log('a user connected')
  backEndPlayers[socket.id]={
    x:500* Math.random(),
    y:500* Math.random(),
    color: `hsl(${360*Math.random()}, 100%, 50%)`
  }
  
  // 만약 방금 연결된 플레이어에 대한 이벤트만 허용하고 싶다면 socket.emit 호출.
  // 모든 플레이어가 새로운 플레이어가 합류했음을 알고 결과를 렌더링하고 싶어서
  // io 사용.

  io.emit('updatePlayers', backEndPlayers)
  
   // 특정 사용자가 연결을 끊었을 때
  socket.on('disconnect', (reason)=>{
    console.log(reason)
    // 백엔드 객체에서 삭제
    delete backEndPlayers[socket.id]
    // 소켓은 어느 클라이언트나 연결돼있음.
    // 클라이언트가 연결을 끊으면 해당 소켓 I를 얻음.

    //FE 업데이트.
    io.emit('updatePlayers', backEndPlayers)
  })
  console.log(backEndPlayers)
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log('server did load')
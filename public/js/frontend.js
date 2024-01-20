const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io()

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height / 2

const players ={}

socket.on('updatePlayers', (backendPlayers)=>{
  for(const id in backendPlayers){
    const backendPlayer = backendPlayers[id]
    if(!players[id]){
      // 객체 구문 장점 : clean / 순서 상관 X / 가독성(저 변수가 무슨 의미?)
      players[id] = new Player({
        x: backendPlayer.x,
        y: backendPlayer.y,
        radius: 10,
        color: 'hsl(0, 100%, 50%)'
      })
    }
  }

  for(const id in players){
    if(!backendPlayers[id]){
      delete players[id]
    }
  }
  console.log(players)
})

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for(const id in players){
    const player = players[id]
    player.draw()
  }
}

animate()

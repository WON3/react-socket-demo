const express = require('express'),
  bodyParser = require('body-parser'),
  socket = require('socket.io');

const app = express();

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../build`))
// REGULAR ENDPOINTS HERE

app.get('/api/example', (req, res, next) => {
  res.status(200).send('hello')
})



const PORT = 4000;
const io = socket(
  app.listen(PORT, () => console.log(`Housten we have lift off on port ${PORT}`))
);




const messages = [];
const privateMessages = {};

const bd =app.get('db')
io.on('connection', socket => {
  console.log('User Connected');
  io.emit('message dispatched', messages);

  // EVERYONE
  // socket.on('message sent', data => {

  //   console.log(data)
  //   messages.push(data.message)
  //   io.emit('message dispatched', messages);
  // })
  

  //  EVERYONE BUT ME
  // socket.on('message sent', data => {
  //   console.log(data)
  //   messages.push(data.message)
  //   socket.broadcast.emit('message dispatched', messages);
  // })

  
  // EVERYONE IN THE ROOM
  socket.on('join room', data => {
    if(!Array.isArray(privateMessages[data.room])){
      privateMessages[data.room] =[]
    }
    console.log('Room joined', data.room)
    socket.join(data.room);
    io.to(data.room).emit('room joined', privateMessages[data.room]);
  })
  socket.on('message sent', data => {
    if(!Array.isArray(privateMessages[data.room])){
      privateMessages[data.room] =[]
    }
    privateMessages[data.room].push(data.message)
    io.to(data.room).emit('message dispatched', privateMessages[data.room]);
  })

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  })
});
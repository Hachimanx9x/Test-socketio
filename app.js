const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 80;
app.get('/', (req, res) =>{
//  res.send("<h1>hola mundo desde udemy</h1>")
res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) =>{
  console.log('un usuario conectado');
});

http.listen(PORT, ()=>{
  console.log(`iniciado en el puerto : ${PORT}`);
});

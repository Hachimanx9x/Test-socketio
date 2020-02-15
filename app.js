//su usa express para iniciar el servidor http
const app = require('express')();
//se usa los protocolos http junto con el servidor de express
const http = require('http').Server(app);
//se le dice a socket.io que use el servidor http para comprobar las conexiones de lso hilos de xonexion
const io = require('socket.io')(http);
//Se inicializa el puerto
const PORT = 80;
//se habilita la primera entrada por defecto
app.get('/', (req, res) =>{
//se le dice que por defecto cargue index.html
res.sendFile(__dirname + "/index.html");
});
//al iniciar una conexion en hilo de envio de datos
io.on('connection', (socket) =>{
  //cuando se ve una nueva coneccion al cargar el html
  //<<ir a linea de index.html 18>>
  //el html manda al server diciendo es una nueva conexion
  console.log(`se conecto usuario`);
  //Cuando se pierde la conexion se ejecuta esta funcion
  socket.on('disconnect',() =>{
    //cuando ocure las desconexion se imprime
    console.log(`de desconectado`);
  });

  socket.on('chat mensage',(msg)=>{
    console.log(msg);
    //mandamos una señal respuesta al recibir una
    socket.broadcast.emit('chat mensage', msg);
  });
});

http.listen(PORT, ()=>{

  //iniciamos el servidor en el puerot establecido
  console.log(`iniciado en el puerto : ${PORT}`);
});

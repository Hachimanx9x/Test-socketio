const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors:  {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3030;
app.use(cors());
app.get('/', (req, res) =>{
//se le dice que por defecto cargue index.html
res.json({msj:"hola"})
});

//se inicio la coneccion
io.on('connection', (socket) =>{
  //se notifica que usuario se conecto
  console.log(`user with id ${socket.id} is connected`)
  //evento de ingresar a una sala
  socket.on('entra room',(room)=>{
    //se notivica que sala es creada / ingresada
  console.log(`Una nuevo usuario entro a la sala ${room}`);
    //se le asigna el objeto de la sala (datos del usuario)
  socket.room =room;
    //se define el hilo de conexion con esa sala
  socket.join(room);
  //se emite un mensaje a todos los que esten en esa sala del nuevo usuario
  io.in(socket.room).emit('entrar',{iserid:socket.id, room  });

  });
  socket.on('disconnect',() =>{
    //cuando ocure las desconexion se imprime
    console.log(`se desconecto el usuario ${socket.id}`);
  });
  //se escucha el evento hablar
  socket.on('hablar',(data)=>{
    // se emite un objeto con lo que dice esa persona y su id
io.in(socket.room).emit('hablar',{raw: data, id :socket.id });
  });
})

http.listen(PORT, ()=>{

  //iniciamos el servidor en el puerot establecido
  console.log(`iniciado en el puerto : ${PORT}`);
});

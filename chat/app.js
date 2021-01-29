//su usa express para iniciar el servidor http
const app = require('express')();
//se usa los protocolos http junto con el servidor de express
const http = require('http').Server(app);
//se le dice a socket.io que use el servidor http para comprobar las conexiones de lso hilos de xonexion
const io = require('socket.io')(http);
const util = require('util');
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
  io.emit('salas', getSalas('conectado'));
  //Cuando se pierde la conexion se ejecuta esta funcion
  socket.on('disconnect',() =>{
    //cuando ocure las desconexion se imprime
    console.log(`se desconectado`);
  });
//al recibir nueva sala se reciben los datos de la sala
socket.on('nueva sala', (sala)=>{
  console.log(`una nueva fue creada ${sala}`)
  //se le asigna el objeto (datos del usuario) de la sala
  socket.sala =sala;
  //se define el hilo de conexion con esa sala
  socket.join(sala);
  //mandamos el estado de la sala a partir de ese hilo
  io.emit('salas',getSalas('nueva sala'));//se emite la info producto de list
});
//en caso de existir la sala en la lista se ingresa
socket.on('entra sala',(sala)=>{
console.log(`Una nuevo usuario entro a la sala ${sala}`);
  //se le asigna el objeto de la sala (datos del usuario)
socket.sala =sala;
  //se define el hilo de conexion con esa sala
socket.join(sala);
  //mandamos el estado de la sala a partir de ese hilo
io.emit('salas',getSalas('entrar sala'));//se emite la info producto de list
});
//en caso de recibir un mensage (enviar / recibir)
  socket.on('chat mensage',(data)=>{
    //se recibe el objeto ccon los datos de la sala en especifico junto con los del usuario
    //luego emitimos el evento chat mensage
    //enviamos el nombre junto con el mensage de quien esta en sala
io.in(data.sala).emit('chat mensage',`${data.nombre}: ${data.msg}`);
  });
  //se obtiene el nombre del usuario
  socket.on('set nombre',(nombre)=>{
    console.log(`El nombre de usuario es ${nombre}(${socket.id})`)
    //se le asigna el nombre de usuario 
    socket.nombreUsuario = nombre;
  });
});

http.listen(PORT, ()=>{

  //iniciamos el servidor en el puerot establecido
  console.log(`iniciado en el puerto : ${PORT}`);
});
function getSalas(msg){
  //name space (nsp) este define cual es el url de la conexion se usa por la de defecto
  const nsp=io.of('/');
  //cuando se obtenga el nombre la sala se crea una sala y el numero de salas se adacta
  //cada sla queda dividida
  const salas = nsp.adapter.salas;
  /*esto queda como
  {'salaId1':{'socketId1', 'socketId2',...,'socketIdN'},
'salaId2':{'socketId3', 'socketId4',...,'socketIdN'},......,
'salaIdN':{'socketId1', 'socketId2',...,'socketIdN'}}
  */
//  console.log(`getSalas: >>`+util.inspect(salas));
  const list ={};
  //recorremos y dividmos las salas
  for(let salaId in salas){
    //asignamos la sala dedicada a partir de una iteracion
    //al usar salaID se sabe que canal se va a usar
    const sala=salas[salaID];
    //en caso de que sala se creo mal y solo sea un espacio vacio
    //se repita la iteracio si todo esta bien continua
    if(sala===undefined) continue;
    const sockets =[];//creamos el array de la sala
    let salaNombre="";//asignamos nombre
    //tanto sockets como salaNombre seran unicos y definira la conexion
    console.log(`getSalas:>>`+util.inspect(sala));
    //recorremos lo sockets que son los hilos de conexion de cada usuario
    for(let socketId in sala.sockets){
      //definimos el hilo a un espacio enviando el hilo donde se conecto el usuario
      const socket =nsp.connected[socketId];
      //verificamos que todo llego bien en caso de que no el for se repite desde este punto
      //si todo llego bien se continua
      if(socket===undefined || socket.nombreUsuario===undefined || socket.sala ===undefined) continue;
      console.log(`getSalas id=${socketId} >> ${socket.nombreUsuario} : ${socket.sala}`);
      //luego insertamos en el hilo de comunixion el nombre del usuario
      //esto crea un hilo donde hay mas un usuario
      sockets.push(socket.nombreUsuario);
      //recopilamos el nombre de la sala a traves de las entrada del socket.on y se los asignamos
      //si ya el hilo esta ocupado tiene que tener un nombre de sala asi que esto no se vuelve a usar
      if(salaNombre =="") salaNombre = socket.sala;
    }
    //en caso de que el nombre de la sala ya se puso sel asigna el a list todos los nombres de las salas

    if(salaNombre !="") list[salaNombre] = sockets;
  }
  console.log(`getSalas: ${msg} >>`+util.inspect(list));
  //retornamos el objeto con la conexion establecida
  return list;
}

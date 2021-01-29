import React from "react"; //pues es react los necesito
import logo from './logo.svg';// el logito que nunca lo quite :3
import './App.css';// los estilos
import io from "socket.io-client";// el cliente del socket.io para poder conectarse
import MicrophoneStream  from 'microphone-stream';// el que nos ayudara a usar el microfono
class App extends React.Component {// se crea la clase componente
  constructor() {// su constructor
      super();//por si vamos a resibir props pero como no lo dejo asi
      this.state={state:"mute",escuchar:false,room: `sala1`, user:"default", compas:[]} // los states
  }
//esto se ejecuta despues de montar el componente
async  componentDidMount(){
      //se manda a que sala queremos trasmitir
    this.socket = io('http://localhost:3030/', {
            reconnectionDelayMax: 10000 // esto es tiempo para reconectarse
        });
    //se manda a que sala queremos trasmitir
     this.socket.emit('entra room', this.state.room)  ;
     //se recibe el evento entrar con el nombre usuario
 this.socket.on('entrar', data => {
   //se reescribe el usaurio actual
   if(this.state.user === "default"){
     this.state.user= data.iserid
   }else{
     //en caso de reescribi el usaurio los siguientes seran los demas compañeros
     this.state.compas.push(data.iserid)

   }

 })
 //los datos de las muestas a usar
     let datos = [];
       //formato a usar
       /* {
           channels: 1,
           bitDepth: 32,
           sampleRate: 48000,
           signed: true,
           float: true
       }*/
       //estrucutra del audio por defecto
       let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
       //se resibe el evento hablar
     this.socket.on('hablar', data => {
       //se saca el array raw que contiene la info del audio y la id de la persona que esta hablando
    const {raw,id} = data ;
  //    console.log(raw)
  //se compara si ya se tienen todas las muestras de un segundo de audio y si el
  //id de la persona es diferente se rellena 'datos' que contendra la informacion del
  // audio
       if (datos.length < 48000 && id !==this.state.user  ) {
         //re recorre raw para almacenar los datos hasta llegar a la cantindad de muestras por segundo
              for (const property in raw) {
                  datos.push(raw[property])
              }
          } else {

              // re estrucutra un búfer estéreo vacío de 1 segundo a la frecuencia de muestreo de AudioContext
              // esto basicamente es crea un aundio basio de 1 canal de 48000 muestras por segundo, a 48000
              var myArrayBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
              // Llene el búfer con ruido blanco;
              for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
                  // Esto nos da la matriz real que contiene los datos
                  var nowBuffering = myArrayBuffer.getChannelData(channel);
                  //esto rellena los datos de nuevo buffer
                  for (var i = 0; i < myArrayBuffer.length; i++) { nowBuffering[i] = datos[i]}
              }
              //Obtenga un AudioBufferSourceNode.
              //Este es el AudioNode para usar cuando queremos reproducir un AudioBuffer
              var source = audioCtx.createBufferSource();
              // establecer el búfer en el AudioBufferSourceNode
              source.buffer = myArrayBuffer;
              // conectar el AudioBufferSourceNode a la destino para que podamos escuchar el sonido
              source.connect(audioCtx.destination);
              // reproduce el sonido
              source.start();
              //limpia los datos para u nuevo muestreo
              datos = []
          }
        });
    //uso y recoleccion del microfono
    // lo que inporta aqui es bufferSize que es el tamaño de las muestra a enviar
    //
    let micStream = new MicrophoneStream({
            stream: null,
            objectMode: false,
            bufferSize: 4096,
            context: null
        });
        //esto le indica al micStream que dispositvo va a usar para escuchar el sonido
  await navigator.mediaDevices.getUserMedia({ audio: true }).then(result=>{
    //el navegador lo ofrece y aqui es tomado por  micStream
            micStream.setStream(result);
    })

    //una vez el micStream escucha algo obtiene un parte de audio
    micStream.on('data', (chunk) => {
           // esto combierte todo en  Float32Array
           // el raw son los datos del audio capturado pero pasados por un coversion
           var raw = MicrophoneStream.toRaw(chunk);
           //esto activa y desactiva el poder usar un microfono
           if (this.state.escuchar) {
             //la variable a enviar
             let temp =[]
             //re procesa para que no sea enviado como Float32Array sino como una array normal
             //esto para evitar errores
             temp = [...raw]
            //se emite la informacion a escuchar por otros usuarios
               this.socket.emit('hablar',temp)
           }
       });
  }
//eventos del boto
  microphone(event){
   //this.state.escuchar esta true
    if(this.state.escuchar){
      //se pondra falso con una variable temporal y el letro del boton sera mute
      let temp = !this.state.escuchar ;
      this.setState({
        state:"Mute",
        escuchar: temp
      })
    }else{
        //se pondra true con una variable temporal y el letro del boton sera Ok
      let temp = !this.state.escuchar ;
      this.setState({
        state:"Ok",
        escuchar: temp
      })
    }

  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          > </a>

          <input type ="button" value={this.state.state} onClick={this.microphone.bind(this)} />
          <p>{
            this.state.compas
          }</p>
        </header>
      </div>
    );
  }
}

export default App;

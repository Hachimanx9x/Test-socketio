const app = require('express')();
const http = require('http').Server(app);

app.get('/', (req, res) =>{
//  res.send("<h1>hola mundo desde udemy</h1>")
res.sendFile(__dirname + "/index.html"); 
});
http.listen(80, ()=>{
  console.log(`inciado desde el puerto ${80}`)
})

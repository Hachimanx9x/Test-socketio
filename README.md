# Test-socketio
Pruebas del uso del socket

Esto solamente seran pruebas para el uso de socket.io

## CHAT
se ejecuta con el comando:

```sh
npm i

 npm start
 o
 npm run dev
 ```
usa nodemon asi que cuando cambia el codigo el se actualiza

>instrucciónes

1. se pone el nombre de nombreUsuario
2. se pone el nombre de sala (en caso de que la sala no exista se crea si existe te unes a ella)
3. luego mandas los mensajes y ya

## CHAT DE VOZ
se ejecuta por separado dado que es un ejemplo de integracion de socket.io-client en react js

se ejecuta en la carpeta server
```sh
npm i

 npm start
 o
 npm run dev
 ```
esto iniciara el servidor

se ejecuta en la carpeta cliente
```sh
yarn

yarn start
 ```

 >instrucciónes

1. entras en la dirreción donde abrio react js (generalmente es http://localhost:3000/)
2. clic en el boton mute para activar el audio y que las demas personas te escuchen

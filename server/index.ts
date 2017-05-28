import * as EventEmitter from 'events';
import * as express from 'express';
import { join } from 'path';
const app = express();
const http = require('http').Server(app);
import * as SocketIO from 'socket.io';
const io = SocketIO(http);

function logger(...messages: any[]) {
  console.log('=========================');
  console.log(messages);
  console.log('=========================');
}

console.log(__dirname)
app.use(express.static(join(__dirname, '..', 'build')));

app.get('/', (_req, res) => {
  res.send(`
    <html>
      <body>
        <div id="app"></div>
        <script src="/bundle.js" type="text/javascript"></script>
      </body>
    </html>
  `);
});

function createId() {
  return String(Math.floor(Math.random() * 1e12));
}

function getRandomInt(boundary: number): number {
  return Math.floor(Math.random() * boundary);
}

const chats: { [key:string]: string[] } = {};
const pool: { [key:string]: any } = {};
const userChats: { [key:string]: string } = {};
const userLanguages: { [key:string]: string } = {};

const matcher = new EventEmitter();

function tryMatch(id: string) {
  const currentUserCode = userLanguages[id];
  console.log(pool, userLanguages, currentUserCode)
  return Object.keys(pool).filter(userId => userLanguages[userId] === currentUserCode);
}

// a person connects
// he waits until we find a person

function findInterlocutor(socket: SocketIO.Socket) {
  const ids = tryMatch(socket.id);
  console.log(ids);
  const tryToMatch = Boolean(ids.length);

  if (tryToMatch === false) {
    logger('Can not find someone, going to pool!');
    pool[socket.id] = true;

    const evtName = `select_user_${socket.id}`;
    matcher.once(evtName, (anotherParticipant: string) => {
      logger('Someone found us!!!!');
      // remove us from the pool
      delete pool[socket.id];
      const newChat = createId();
      chats[newChat] = [socket.id, anotherParticipant];
      userChats[socket.id] = newChat;
      userChats[anotherParticipant] = newChat;
      socket.emit('connected', { chatId: newChat });
      socket.join(newChat);
    });
  } else {
    const index = getRandomInt(ids.length);
    const evtName = `select_user_${ids[index]}`;
    logger('Found someone', ids[index]);
    matcher.emit(evtName, socket.id);
    const newChat = userChats[socket.id];
    socket.emit('connected', { chatId: newChat });
    socket.join(newChat);
  }
}

io.on('connection', (socket: SocketIO.Socket) => {
  console.log('a user connected');
  console.log(socket.id);

  socket.on('language', (code: string) => {
    userLanguages[socket.id] = code;
    findInterlocutor(socket);
  });

  socket.on('message', ({ message }: { message: string }) => {
    const chatRoom = userChats[socket.id];
    logger('message was sent!', chatRoom);
    if (chatRoom) {
      socket.to(chatRoom).emit('message', { message });
    }
  });

  socket.on('reconnect', () => {
    delete userChats[socket.id];
    findInterlocutor(socket);
  });

  socket.on('disconnect', () => {
    logger('disconnect...');
    const chatRoom = userChats[socket.id];
    delete userChats[socket.id];
    delete chats[chatRoom];
    socket.to(chatRoom).emit('leave', 'Your interlocutor left the room :(');
    console.log('user disconnected');
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`app is started on ${PORT} port!`);
});
import * as socketIO from 'socket.io-client';
const socket = socketIO('', {
  forceNew: true
});

export interface Message {
  id: string,
  message: string
}

export interface Store {
  connected: boolean,
  messages: Message[],
  left: boolean
}

export const store = {
  connected: false,
  messages: ([] as Message[]),
  left: false
};

socket.on('connected', () => {
  console.log('connected, clearing the messages');
  store.connected = true;
  store.messages = [];
});

socket.on('leave', () => {
  store.left = true;
});

socket.on('message', ({ message }: any) => {
  const newElement: Message = {
    id: 'not_you',
    message
  };
  store.messages.push(newElement);
});

export function sendMessage(message: string) {
  const newElement: Message = {
    id: 'you',
    message
  };
  store.messages.push(newElement);
  socket.emit('message', { message });
}

export function chooseLanguage(code: string) {
  socket.emit('language', code);
}
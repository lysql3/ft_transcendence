import { io } from 'socket.io-client';
import { readFileSync } from 'fs';

const line = readFileSync('../cookies.txt', 'utf-8')
  .split('\n')
  .find((l) => l.includes('session_token'));
const [name, value] = [line.split('\t')[5], line.split('\t')[6]];
const cookie = `${name}=${value}`;

const socket = io('http://localhost:3000', {
  extraHeaders: { cookie },
  transports: ['websocket'],
});

socket.on('connect', () => console.log('connected, id =', socket.id));
socket.on('connect_error', (err) => console.log('error connexion :', err.message));
socket.on('disconnect', (reason) => console.log('disconnect :', reason));
socket.on('submission:updated', (data) => console.log('submission:updated :', data));

socket.emit('ping', { hello: 'world' }, (res) => console.log('response ping :', res));

console.log('(Ctrl+C to quit)...');

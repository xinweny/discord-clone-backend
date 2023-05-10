import { Socket } from 'socket.io';

const onConnection = (socket: Socket) => {
  const accessToken = socket.handshake.query.accessToken as string | undefined;

  if (!accessToken) return socket.disconnect();

  // jwt.verify to validate user

  socket.on('startDMs', (data) => console.log(data));
  // socket.on('sendMessage', message => text.type === 'CHANNEL' or 'DM', emit to relevant channel)
};

export default onConnection;
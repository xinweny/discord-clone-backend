import { Socket } from 'socket.io';

const onJoinDirectMessage = (socket: Socket) => {
  return async (chatId: string) => {
    socket.join(chatId);
  };
}

export default onJoinDirectMessage;
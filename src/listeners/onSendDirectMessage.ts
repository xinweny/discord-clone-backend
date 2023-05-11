import { Types } from 'mongoose';

import MessageService from '../services/message.service';
import { io } from '../server';

const onSendDirectMessage = (
  senderId: Types.ObjectId,
) => {
  return async (req: {
    chatId: Types.ObjectId,
    body: string,
    attachments: string[] | undefined;
  }) => {
    const message = await MessageService.create(senderId, req.chatId, req.body, req.attachments);

    io.sockets
      .in(req.chatId.toString())
      .emit('receive_direct_message', message);
  };
};

export default onSendDirectMessage;
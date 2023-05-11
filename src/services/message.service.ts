import { Types } from 'mongoose';
import Message from '../models/Message.model';

const create = async (
  senderId: Types.ObjectId,
  chatId: Types.ObjectId,
  body: string,
  attachments?: string[],
) => {
  const message = new Message({
    senderId,
    chatId,
    body,
    ...(attachments && { attachments }),
  });

  await message.save();
  
  return message;
};

export default {
  create,
}
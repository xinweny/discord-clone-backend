import { Types } from 'mongoose';
import Message from '../models/Message.model';

import keepKeys from '../helpers/keepKeys';

const create = async (
  senderId: Types.ObjectId | string,
  chatId: Types.ObjectId | string,
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

const update = async (
  id: string,
  updateFields: {
    body?: string,
    attachments?: string[],
  },
) => {
  const updateQuery = keepKeys(updateFields, ['body', 'attachments']);

  const updatedUser = await Message.findByIdAndUpdate(id, {
    $set: {
      ...updateQuery,
      updatedAt: new Date(),
    },
  }, { new: true });

  return updatedUser;
}

export default {
  create,
  update,
}
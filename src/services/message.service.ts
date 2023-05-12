import { Types } from 'mongoose';

import Message, { IMessage } from '../models/Message.model';

import keepKeys from '../helpers/keepKeys';

const create = (fields: {
  senderId: Types.ObjectId | string,
  chatId: Types.ObjectId | string,
  body: string,
  attachments?: string[],
}) => {
  const message = new Message(fields);
  
  return message;
};

const save = async (message: IMessage) => await message.save();

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
  save,
  update,
}
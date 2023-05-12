import { Types } from 'mongoose';

import Message, { IMessage } from '../models/Message.model';

import keepKeys from '../helpers/keepKeys';

const get = async (fields: {
  _id?: Types.ObjectId | string,
  senderId?: Types.ObjectId | string,
  roomId?: Types.ObjectId | string,
}) => {
  const messages = await Message.find(fields);

  return messages;
}

const create = (fields: {
  senderId: Types.ObjectId | string,
  roomId: Types.ObjectId | string,
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
  get,
  create,
  save,
  update,
}
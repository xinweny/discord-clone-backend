import { Types } from 'mongoose';

import Message from '../models/Message.model';

const getOne = async (id: string) => {
  const message = await Message.findById(id);

  return message;
}

const getMany = async (fields: {
  senderId?: Types.ObjectId | string,
  roomId?: Types.ObjectId | string,
}) => {
  const messages = await Message.find(fields);

  return messages;
}

const create = async (fields: {
  senderId: Types.ObjectId | string,
  roomId: Types.ObjectId | string,
  body: string,
  attachments?: string[],
  type: 'DirectMessage' | 'Channel',
}) => {
  const message = new Message(fields);

  await message.save();
  
  return message;
};

const update = async (
  id: string,
  fields: {
    body?: string,
    attachments?: string[],
  },
) => {
  const updatedMessage = await Message.findByIdAndUpdate(id, {
    $set: fields,
  }, { new: true });

  return updatedMessage;
};

const del = async (id: string) => {
  await Message.findByIdAndDelete(id);
};

const react = async (messageId: Types.ObjectId | string, emoji: string)

export default {
  getOne,
  getMany,
  create,
  update,
  del,
}
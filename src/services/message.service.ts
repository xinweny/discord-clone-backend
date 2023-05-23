import { Types } from 'mongoose';
import emojilib from 'emojilib';

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

const react = async (
  messageId: Types.ObjectId | string,
  emoji: string | {
    id: string,
    url: string,
    name: string,
  }
) => {
  const message = await Message.findById(messageId);

  if (!message) return null;

  const custom = typeof emoji !== 'string';

  let identifier, updateField, emojiExists, setQuery;

  if (custom) {
    identifier = emoji.id;
    updateField = 'reactions.emojiId';

    setQuery = {
      emojiId: emoji.id,
      url: emoji.url,
      name: emoji.name,
    };

    emojiExists = message.reactions.some(reaction => reaction.emojiId?.toString() === emoji.id);
  } else {
    identifier = emoji;
    updateField = 'reactions.emoji';

    setQuery = {
      emoji,
      name: emojilib[emoji][0].replace(' ', '_'),
    };

    emojiExists = message.reactions.some(reaction => reaction.emoji === emoji);
  }

  const updateQuery = emojiExists
  ? { $inc: { 'reactions.$.count': 1 } }
  : {
      $push: {
        reactions: {
          ...setQuery,
          count: 0,
        }
      }
    };

  console.log({
    _id: messageId,
    ...(emojiExists && { [updateField]: identifier }),
  });

  const reactedMessage = await Message.findOneAndUpdate(
    {
      _id: messageId,
      ...(emojiExists && { [updateField]: identifier }),
    },
    updateQuery,
    { new: true }
  );

  return reactedMessage;
}

export default {
  getOne,
  getMany,
  create,
  update,
  del,
  react,
}
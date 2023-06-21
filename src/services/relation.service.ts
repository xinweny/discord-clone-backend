import { Types } from 'mongoose';

import CustomError from '../helpers/CustomError';
import formatSetQuery from '../helpers/formatSetQuery';

import User from '../models/User.model';

const getRelations = async (userId: Types.ObjectId | string, status?: 0 | 1 | 2) => {
  const user = await User.findById(userId, 'relations');

  if (!user) throw new CustomError(400, 'User not found.');

  const relations = (status)
    ? user.relations.find(relation => relation.status === status)
    : user.relations;

  return relations;
};

const sendFriendRequest = async (senderId: Types.ObjectId | string, recipientId: Types.ObjectId | string) => {
  const [sender, recipient] = await Promise.all(
    [senderId, recipientId].map(id => User.findById(id))
  );

  if (!sender || !recipient) throw new CustomError(400, 'User not found.');

  const relations = [
    sender.relations.find(relation => relation.userId.equals(recipientId)),
    recipient.relations.find(relation => relation.userId.equals(senderId)),
  ];

  if (relations.some(relation => !!relation)) throw new CustomError(400, 'Relation already exists.');

  sender.relations.push({ userId: recipientId });
  recipient.relations.push({ userId: senderId });

  await Promise.all([sender.save(), recipient.save()]);

  const [senderRelation, recipientRelation] = [sender, recipient].map(user => user.relations.slice(-1)[0]);

  return { senderRelation, recipientRelation };
};

const acceptFriendRequest = async (userId: Types.ObjectId | string, relationId: Types.ObjectId | string) => {
  const user = await User.findById(userId, 'relations');

  if (!user) throw new CustomError(400, 'User not found.');

  const toRelation = user.relations.id(relationId);
  const recipient = await User.findById(toRelation?.userId, 'relations');

  if (!recipient) throw new CustomError(400, 'User not found.');

  const fromRelation = recipient.relations.find(relation => relation.userId.equals(userId));

  const relations = [toRelation, fromRelation];

  if (relations.some(relation => !relation || relation.status !== 0)) throw new CustomError(400, 'Friend request does not exist.');

  relations.forEach(relation => relation?.set({ status: 1 }));

  await Promise.all([user.save(), recipient.save()]);

  return { sender: relations[0], recipient: relations[1] };
};

const blockUser = async (senderId: Types.ObjectId | string, recipientId: Types.ObjectId | string) => {
  const [sender, recipient] = await Promise.all(
    [senderId, recipientId].map(id => User.findById(id))
  );

  if (!sender || !recipient) throw new CustomError(400, 'User not found.');

  const relations = {
    to: sender.relations.find(relation => relation.userId.equals(recipientId)),
    from: recipient.relations.find(relation => relation.userId.equals(senderId)),
  };

  const { to, from } = relations;

  if (from && (from.status === 0 || from.status === 1)) {
    recipient.relations.pull(from._id);
    await recipient.save();
  }

  if (!to) {
    sender.relations.push({ userId: recipientId, status: 2 });

    await sender.save();

    return sender.relations.slice(-1)[0];
  } else {
    const user = await User.findOneAndUpdate(
      { _id: senderId, 'relations.userId': recipientId },
      { $set: formatSetQuery({ status: 2 }, 'relations') },
      { new: true }
    );

    return user?.relations.id(to._id);
  }
};

const remove = async (userId: Types.ObjectId | string, relationId: Types.ObjectId | string) => {
  const user = await User.findById(userId, 'relations');

  if (!user) throw new CustomError(400, 'User not found.');

  const relation = user.relations.id(relationId);

  if (!relation) throw new CustomError(400, 'Relation does not exist');

  const { status } = relation;

  if (status === 0 || status === 1) {
    const recipient = await User.findById(relation.userId, 'relations');
      
    const recipientRelation = recipient?.relations.find(relation => relation.userId.equals(userId));

    user.relations.pull(relation._id);
    recipient?.relations.pull(recipientRelation?._id);

    await Promise.all([user.save(), recipient?.save()]);
  } else if (status === 2) {
    user.relations.pull(relation._id);

    await user.save();
  }

  return relation;
};

export default {
  getRelations,
  sendFriendRequest,
  acceptFriendRequest,
  blockUser,
  remove,
};
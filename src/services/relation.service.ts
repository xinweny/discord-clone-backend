import { Types } from 'mongoose';

import CustomError from '../helpers/CustomError';

import User from '../models/User.model';

const getRelations = async (userId: Types.ObjectId | string, status?: 0 | 1 | 2) => {
  const user = await User
    .findById(userId, 'relations')
    .populate('relations.user', 'displayName username avatarUrl -_id');

  if (!user) throw new CustomError(400, 'User not found.');

  const relations = (status)
    ? user.relations.find(relation => relation.status === status)
    : user.relations;

  return relations;
};

const sendFriendRequest = async (senderId: Types.ObjectId | string, recipientId: Types.ObjectId | string) => {
  const [sender, recipient] = await Promise.all(
    [senderId, recipientId].map(id => User.findById(id, 'relations'))
  );

  if (!sender || !recipient) throw new CustomError(400, 'User not found.');

  const relations = {
    sender: sender.relations.find(relation => relation.userId.equals(recipientId)),
    recipient: recipient.relations.find(relation => relation.userId.equals(senderId)),
  };

  if (relations.recipient || (relations.sender && relations.sender.status !== 0)) {
    throw new CustomError(400, 'Relation already exists.', {
      sender: relations.sender || null,
      recipient: relations.recipient || null,
    });
  }

  recipient.relations.push({ userId: senderId, status: 0 });

  await recipient.save();

  const relation = recipient.relations.slice(-1)[0];

  return relation;
};

const acceptFriendRequest = async (userId: Types.ObjectId | string, relationId: Types.ObjectId | string) => {
  const user = await User.findById(userId, 'relations');

  if (!user) throw new CustomError(400, 'User not found.');

  const toRelation = user.relations.id(relationId);
  if (!toRelation || toRelation.status !== 0) throw new CustomError(400, 'Friend request does not exist.');

  const sender = await User.findById(toRelation.userId, 'relations');

  if (!sender) throw new CustomError(400, 'User not found.');

  const fromRelation = sender.relations.find(relation => relation.userId.equals(userId));

  if (fromRelation && fromRelation.status !== 0) {
    user.relations.pull(toRelation._id);

    await user.save();

    throw new CustomError(400, 'Unable to accept friend request.');
  }

  (fromRelation)
    ? fromRelation.set({ status: 1 })
    : sender.relations.push({ userId, status: 1 })

  toRelation.set({ status: 1 });

  await Promise.all([user.save(), sender.save()]);

  return { sender: fromRelation, recipient: toRelation };
};

const blockUser = async (senderId: Types.ObjectId | string, recipientId: Types.ObjectId | string) => {
  const [sender, recipient] = await Promise.all(
    [senderId, recipientId].map(id => User.findById(id, 'relations'))
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
    to.set({ status: 2 });

    await sender.save();

    return to;
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
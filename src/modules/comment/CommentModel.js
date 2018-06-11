// @flow
import mongoose from 'mongoose';

import User from './User';
const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
  {
    author: {
      type: ObjectId,
      ref: 'User',
      description: 'User that created this comment',
      required: true,
    },
    score: {
      type: Number,
      description: 'Sum of all upvotes/downvotes this comment has',
      required: false,
    },
    post: {
      type: ObjectId,
      ref: 'Post',
      description: 'post of this comment',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'comment',
  },
);

export default mongoose.model('Comment', Schema);

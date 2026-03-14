import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { sessionId, accessToken } = req.cookies;

    if (!sessionId || !accessToken) {
      throw createHttpError(401);
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw createHttpError(401);
    }

    const session = await Session.findOne({
      _id: sessionId,
      accessToken,
    });

    if (!session) {
      throw createHttpError(401);
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401);
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

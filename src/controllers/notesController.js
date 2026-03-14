import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    let { page = 1, perPage = 10, tag, search } = req.query;

    page = Number(page);
    perPage = Number(perPage);
    const skip = (page - 1) * perPage;

    let query = Note.find().where('userId').equals(req.user._id);

    if (tag) {
      query = query.where('tag').equals(tag);
    }

    if (search && search.trim() !== '') {
      query = query.where({ $text: { $search: search.trim() } });
    }

    const totalNotes = await Note.countDocuments(query.getFilter());

    const notes = await query.skip(skip).limit(perPage).sort({ createdAt: -1 });

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne()
      .where('_id')
      .equals(req.params.noteId)
      .where('userId')
      .equals(req.user._id);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

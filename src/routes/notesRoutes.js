import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema
} from '../validations/notesValidation.js';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.get('/', celebrate(getAllNotesSchema), getAllNotes);
router.get('/:noteId', celebrate(noteIdSchema), getNoteById);
router.post('/', celebrate(createNoteSchema), createNote);
router.delete('/:noteId', celebrate(noteIdSchema), deleteNote);
router.patch('/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;

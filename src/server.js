import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { isCelebrateError } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectMongoDB();

app.use(logger);
app.use(cors());
app.use(express.json());

app.use('/notes', notesRoutes);

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body') ||
                      err.details.get('query') ||
                      err.details.get('params');

    const messages = errorBody?.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    })) || [{ field: 'unknown', message: 'Validation error' }];

    return res.status(400).json({
      message: 'Validation error',
      errors: messages
    });
  }
  next(err);
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

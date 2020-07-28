import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';

import cors from 'cors';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import rateLimiter from './middlewares/rateLimiter';

import routes from './routes';

import '@shared/container';
import '@shared/infra/typeorm';

const app = express();
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.use('/files', express.static(uploadConfig.uploadsFolder));

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port 3333');
});

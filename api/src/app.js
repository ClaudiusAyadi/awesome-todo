import { logger } from './libraries/logger/index.js';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

app.use(logger);
app.use(cors());
app.options('*', cors());

const limiter = rateLimit({
	limit: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour.',
	standardHeaders: 'draft-8',
	legacyHeaders: false,
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(compression());

export default app;

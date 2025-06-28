import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import { errorHandler } from './middlewares/errorMiddleware'; 

const app = express();

// Create temp folder for file compression
import { existsSync, mkdirSync } from 'fs';
if (!existsSync('temp')) {
  mkdirSync('temp');
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
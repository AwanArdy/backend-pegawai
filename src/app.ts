import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import masterRoutes from './routes/masterRoutes';
import pegawaiRoutes from './routes/pegawaiRoutes';
import approvalRoutes from './routes/approvalRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import dokumenRoutes from './routes/dokumenRoutes';
import reminderRoutes from './routes/reminderRoutes';


dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
}));

app.use(express.json());
app.use('/api/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);


app.use('/api/master', masterRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dokumen', dokumenRoutes);
app.use('/api/reminders', reminderRoutes);


// Health Check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend SIKAPAS TypeScript is running' });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;

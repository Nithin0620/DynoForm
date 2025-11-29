import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import routes from './routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });


app.use('/api', routes);



const startServer = async () => {
    try {
        await connectDatabase();
        
        app.listen(PORT, () => {
            console.log(`server started successfully on port: ${PORT}`)
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

app.get('/', (req: Request, res: Response) => {
  res.json({
     message: `<h1>The server has started and is running on port ${PORT}</h1>`,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: '/api'
  });
});

export default app;

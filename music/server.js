import app from './src/app.js';
import connectDB from './src/db/db.js';
import initSocketServer from './src/sockets/socket.server.js';
import http from 'http';

const httpServer = http.createServer(app);

connectDB();
initSocketServer(httpServer);

const PORT = process.env.PORT || 5002;


httpServer.listen(PORT, () => {
    console.log(`Music service is running on port ${PORT}`);
});
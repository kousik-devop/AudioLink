import app from './src/app.js';
import connectDB from './src/db/db.js';
import { connect } from './src/broker/cloudmq.js';

connectDB();
connect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
});
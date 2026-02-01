import app from './src/app.js';
import {connect} from './src/broker/cloudmq.js';
import startListener from './src/broker/listner.js';

connect().then(startListener);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
});
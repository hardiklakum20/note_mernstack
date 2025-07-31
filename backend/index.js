const express = require('express');
const ConnectDB = require('./db/db');
const dotenv = require('dotenv');
dotenv.config();
const AuthRoute = require('./router/AuthRoute');
const NoteRoute = require('./router/NoteRoute');
const ProfileRoute = require('./router/ProfileRoute');
const ProtectRoute = require('./router/ProtectionRoute');
const cors = require('cors');

const app = express();
ConnectDB();

app.use(express.json());
app.use(cors());

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use('/api', AuthRoute);
app.use('/api', NoteRoute);
app.use('/api', ProfileRoute);
app.use('/api', ProtectRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
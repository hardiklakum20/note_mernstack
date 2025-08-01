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

const allowedOrigins = [
    'https://shoesx-mernstack.vercel.app',
    'http://localhost:3000',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl, mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use('/api', AuthRoute);
app.use('/api', NoteRoute);
app.use('/api', ProfileRoute);
app.use('/api', ProtectRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
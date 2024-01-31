const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const mongoConnection = require('./database/mongoConnection');
const Moralis = require('moralis').default;


dotenv.config({ path: '../config/config.env' });

const app = express();

mongoConnection();



app.use(express.json());

app.use('/auth/', require('./routes/authRoutes'))
app.use('/moralis/user/', require('./routes/chainInfoRoutes'))

Moralis.start({
    apiKey: process.env.MORALIS_API,
  }).then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on ${process.env.PORT}`);
    });
  });
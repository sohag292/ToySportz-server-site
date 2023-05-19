const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 2000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Toysportz server is running')
  })
  
  app.listen(port, () => {
    console.log(`Toysportz server is running on port ${port}`)
  })

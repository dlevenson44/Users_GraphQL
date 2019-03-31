const express = require('express');

// create new app
const app = express();

// listen to specific port
app.listen(4000, () => {
  console.log('listening')
})


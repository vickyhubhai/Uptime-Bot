const express = require('express');
const app = express();

// Respond to GET requests on /ping with a timestamp
app.get('/ping', (req, res) => {
  res.send(new Date());
});

// Listen on the port set by the environment or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Keepalive server started on port ${PORT}`);
});

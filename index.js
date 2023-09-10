// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Define a route for /api/:timestamp
app.get('/api/:timestamp', (req, res) => {
  const { timestamp } = req.params;

  // Parse the timestamp as an integer
  const unixTimestamp = parseInt(timestamp);

  // Check if the parsed timestamp is a valid number
  if (isNaN(unixTimestamp)) {
    return res.json({ error: 'Invalid Unix Timestamp' });
  }

  // Convert Unix timestamp to a Date object
  const dateObject = new Date(unixTimestamp);

  // Check if the date is valid
  if (!isNaN(dateObject.getTime())) {
    return res.json({ unix: unixTimestamp, utc: dateObject.toUTCString() });
  } else {
    return res.json({ error: 'Invalid Date' });
  }
});

// Define a route for /api/:date?
app.get('/api/:date?', (req, res) => {
  const { date } = req.params;

  // Handle empty date parameter (current time)
  if (!date) {
    const currentTime = new Date();
    return res.json({ unix: currentTime.getTime(), utc: currentTime.toUTCString() });
  }

  // Parse the date string using date-fns
  const dateObject = parseISO(date);

  // Check if the date is valid
  if (isValid(dateObject)) {
    return res.json({ unix: dateObject.getTime(), utc: dateObject.toUTCString() });
  } else {
    return res.json({ error: 'Invalid Date' });
  }
});



// Error handling middleware for handling uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});




// listen for requests :)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

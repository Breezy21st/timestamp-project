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


app.get('/api/:date?', (req, res) => {
  const { date } = req.params;

  // Check if the request is for a Unix timestamp (numeric) or a date string
  if (!isNaN(date)) {
    // Handle Unix timestamp request
    const unixTimestamp = parseInt(date);
    const dateObject = new Date(unixTimestamp);

    if (!isNaN(dateObject.getTime())) {
      const utcString = dateObject.toUTCString();
      return res.json({ unix: unixTimestamp, utc: utcString });
    }
  } else {
    // Handle date string request
    // Attempt to parse the date string in the format "YYYY-MM-DD"
    const dateParts = date.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Months are 0-based (0-11)
      const day = parseInt(dateParts[2]);

      // Check if the parsed date is valid
      const dateObject = new Date(year, month, day);
      if (!isNaN(dateObject.getTime())) {
        const unixTimestamp = dateObject.getTime(); // Get timestamp in milliseconds
        const utcString = dateObject.toUTCString();
        return res.json({ unix: unixTimestamp, utc: utcString });
      }
    }
  }

  // If neither Unix timestamp nor valid date string, return an error
  return res.json({ error: 'Invalid Date' });
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

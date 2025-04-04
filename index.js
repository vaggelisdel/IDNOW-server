const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // ✅ Import CORS
const { init, start, getResults, getImage } = require('./src');

const app = express();
const port = process.env.PORT || 3003;

// ✅ Enable CORS for all routes
app.use(cors());

// load .env.local
// const envLocal = '.env.local';
// if (fs.existsSync(envLocal)) {
//     const envConfig = dotenv.parse(fs.readFileSync(envLocal))
//     for (const k in envConfig) {
//         process.env[k] = envConfig[k]
//     }
// } else {
//     console.error('Missing .env.local file with your credentials.');
//     return;
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Exemples Controller
 */
// read all html files
// let examplesFiles;
// const exampleDir = path.join(__dirname, '/../examples');
// fs.readdir(exampleDir, function(err, files) {
//   //handling error
//   if (err) {
//     return console.log('Unable to scan directory: ' + err);
//   }
//   examplesFiles = files;
// });

// app.use(
//   '/examples/assets',
//   express.static(path.join(__dirname, '/../examples/assets')),
// );
// app.get('/examples/:id', function(req, res) {
//   // map id with html file
//   res.sendFile(
//     path.join(__dirname, '/../examples', examplesFiles[req.params.id]),
//   );
// });

/**
 * API controller
 */
function handleError(res, error) {
  res.statusCode = 500;
  if (error.response && error.response.data) {
    res.send(error.response.data);
  } else if (typeof error === 'string') {
    res.send({ errorCode: error, errorMessage: error });
  } else {
    res.send(error);
  }
}

init();

app.get('/api/start', (req, res) => {
  const language = req.headers['accept-language'] || 'EN'; // Default to 'EN' if not provided
  console.log("Started....");

  start(language)  // Pass language to the function
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      handleError(res, error);
    });
});

app.get('/api/results/:fileUid', (req, res) => {
  getResults(req.params.fileUid)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      handleError(res, error);
    });
});

app.get('/api/document/:documentUid/image/:imageUid', (req, res) => {
  getImage(req.params.documentUid, req.params.imageUid)
    .then(data => {
      res.write(data);
      res.end();
    })
    .catch(error => {
      handleError(res, error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

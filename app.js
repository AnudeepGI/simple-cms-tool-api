const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use(expressSanitizer());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'test@123',
  database: 'cms'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.get('/getall',(req, res) => {

  const query = 'SELECT * FROM `content_entries` WHERE 1';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error saving content to the database', err);
      return res.status(500).send('Error saving content');
    }
    console.log(result)
    res.send('Content saved successfully');
  });

});

app.get('/get-all-content', (req, res) => {
  const query = 'SELECT * FROM content_entries';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching content from the database:', err);
      return res.status(500).send('Error fetching content');
    }

    res.json(results);
  });
});

app.post('/save-content', (req, res) => {
  const { path, content } = req.body;

  const sanitizedContent = req.sanitize(content);
  const sanitizedPath = req.sanitize(path);

  const query = 'INSERT INTO content_entries (path, content) VALUES (?, ?)';

  connection.query(query, [sanitizedPath, sanitizedContent], (err, result) => {
    if (err) {
      console.error('Error saving content to the database:', err);
      return res.status(500).send('Error saving content');
    }
    
    res.json({msg:"Content saved successfully"});
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

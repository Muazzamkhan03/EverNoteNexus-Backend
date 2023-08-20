const connectDb = require('./connection');
const express = require('express');


connectDb();
const app = express();
const port = 5000;

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
})
app.use('/api/notes',require('./Routes/note'));
app.use('/api/auth',require('./Routes/auth'));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
})
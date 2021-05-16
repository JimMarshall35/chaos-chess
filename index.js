const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/
app.get('/', (req, res) => {
  res.sendFile('index.html');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
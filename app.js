const express = require('express');
const app = express();
const port = 3000;

const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/tasks', taskRoutes);

// Health check endpoint
app.get('/ping',(req, res) => {
    res.status(200).send('pong');
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
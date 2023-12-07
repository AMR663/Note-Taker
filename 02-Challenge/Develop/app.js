const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.port || 3001;


app.use(express.json());
app.use(express.static('public'));



app.get('/notes', (request, response) => {
    response.sendfile('notes.html', { root: __dirname + '/public' });
});


app.get('/api/notes', (request, response) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        let notes = JSON.parse(data);
        response.send(notes);
    })

});

app.post('/api/notes', (request, response) => {
    let note = request.body;
    note.id = Date.now();
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        let notes = JSON.parse(data);
        notes.push(note);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (error) => {
            console.log(error);
            response.sendStatus(200);
        })
    })

});

app.delete('/api/notes/:id', (request, response) => {
    let id = parseInt(request.params.id);
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        let notes = JSON.parse(data);
        let newNotes = notes.filter((note) => {
            return note.id != id;
        });
        fs.writeFile('./db/db.json', JSON.stringify(newNotes), (error) => {
            console.log(error);
            response.sendStatus(200);
        })
    });

});

app.get('*', (request, response) => {
    response.sendfile('index.html', { root: __dirname + '/public' });
});





app.listen(port, () => {
    console.log('Listening on port:', port);
});
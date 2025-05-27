const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const FILE = 'notes.json';

app.use(express.json());

function loadNotes() {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function saveNotes(notes) {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

// Update Note
app.put('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let notes = loadNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }

    // Update the note's text (you can expand this for other fields)
    notes[noteIndex].text = req.body.text;
    saveNotes(notes);
    res.json(notes[noteIndex]);
});


// Create Note
app.post('/notes', (req, res) => {
    const notes = loadNotes();
    const note = { id: Date.now(), text: req.body.text };
    notes.push(note);
    saveNotes(notes);
    res.status(201).json(note);
});

// Read Notes
app.get('/notes', (req, res) => {
    const notes = loadNotes();
    res.json(notes);
});

// Delete Note
app.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let notes = loadNotes();
    const newNotes = notes.filter(note => note.id !== id);
    saveNotes(newNotes);
    res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

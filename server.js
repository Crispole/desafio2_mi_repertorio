const express = require('express');
const fs = require('node:fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const repertorioPath = path.join(__dirname, 'repertorio.json');


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//obtener todas las canciones
app.get('/canciones', (req, res) => {
    fs.readFile(repertorioPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        res.send(JSON.parse(data));
    });
});

//agregar una nueva canción
app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    if (!nuevaCancion.id || !nuevaCancion.titulo || !nuevaCancion.artista) {
        return res.status(400).json({ error: 'La canción debe tener todos los datos necesarios' });
    }
    fs.readFile(repertorioPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        const canciones = JSON.parse(data);
        canciones.push(nuevaCancion);
        fs.writeFile(repertorioPath, JSON.stringify(canciones), 'utf-8', (err) => {
            if (err) {
                return res.status(500).send('Error guardando la canción');
            }
            res.send('Canción agregada');
        });
    });
});

//actualizar una canción existente
app.put('/canciones/:id', (req, res) => {
    const id = req.params.id;
    const cancionActualizada = req.body;
    fs.readFile(repertorioPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        let canciones = JSON.parse(data);
        canciones = canciones.map(c => c.id === parseInt(id) ? cancionActualizada : c);
        fs.writeFile(repertorioPath, JSON.stringify(canciones), 'utf-8', (err) => {
            if (err) {
                return res.status(500).send('Error actualizando la canción');
            }
            res.send('Canción actualizada');
        });
    });
});

//eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(repertorioPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        let canciones = JSON.parse(data);
        canciones = canciones.filter(c => c.id !== parseInt(id));
        fs.writeFile(repertorioPath, JSON.stringify(canciones), 'utf-8', (err) => {
            if (err) {
                return res.status(500).send('Error eliminando la canción');
            }
            res.send('Canción eliminada');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor on http://localhost:${PORT}`);
});

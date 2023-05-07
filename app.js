const express = require('express');
const fs = require('fs');
const app = express();

const PORT = 3000;

app.use(express.json());

// Listar todos los elementos
app.get('/elementos', (req, res) => {
  fs.readFile('./database.json', (err, data) => {
    if (err) throw err;

    const elementos = JSON.parse(data);
    res.json(elementos);
  });
});

// Mostrar un elemento por su ID
app.get('/elementos/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile('./database.json', (err, data) => {
    if (err) throw err;

    const elementos = JSON.parse(data);
    const elemento = elementos.find((e) => e.id === id);

    if (!elemento) {
      res.status(404).send('Elemento no encontrado');
    } else {
      res.json(elemento);
    }
  });
});

// Crear un elemento
app.post('/elementos', (req, res) => {
  const elemento = req.body;

  fs.readFile('./database.json', (err, data) => {
    if (err) throw err;

    const elementos = JSON.parse(data);
    elemento.id = Date.now().toString();
    elementos.push(elemento);

    fs.writeFile('./database.json', JSON.stringify(elementos), (err) => {
      if (err) throw err;

      res.status(201).send('Elemento creado');
    });
  });
});

// Actualizar un elemento existente
app.put('/elementos/:id', (req, res) => {
  const id = req.params.id;
  const nuevoElemento = req.body;

  fs.readFile('./database.json', (err, data) => {
    if (err) throw err;

    const elementos = JSON.parse(data);
    const index = elementos.findIndex((e) => e.id === id);

    if (index === -1) {
      res.status(404).send('Elemento no encontrado');
    } else {
      elementos[index] = {
        ...nuevoElemento,
        id: id,
      };

      fs.writeFile('./database.json', JSON.stringify(elementos), (err) => {
        if (err) throw err;

        res.send('Elemento actualizado');
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

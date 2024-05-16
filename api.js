const express = require('express');
const path = require('path');
const fs = require('fs');
const server = express();
const allMaps = require('./src/data/maps.json')
const allOperators = require('./src/data/operators.json')
const port = 3000

server.get('/maps', (req, res) => {
    return res.json(allMaps);
})

server.get('/maps/:id', (req, res) => {
    const mapId = req.params.id;
    const map = allMaps.find(map => map.id.toString() === mapId.toString());

    if (!map) {
        return res.status(404).json({ error: 'Map not found' });
    }

    return res.json(map);
});

server.get('/operators', (req, res) => {
    return res.json(allOperators);
})

server.get('/operators/:id', (req, res) => {
    const opId = req.params.id;
    const operator = allOperators.find(operator => operator.id.toString() === opId.toString());

    if (!operator) {
        return res.status(404).json({ error: 'Operator not found' });
    }

    return res.json(operator);
});

server.get('/images/:type/:imageName', (req, res) => {
    const mapsDir = path.join(__dirname, 'assets', req.params.type);
    const imageName = req.params.imageName + '.png';
    const imagePath = path.join(mapsDir, imageName);

    // Verifica se o arquivo existe
    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: `${req.params.type} not found` });
    }

    // Envia a imagem como resposta
    res.sendFile(imagePath);
});

server.listen(port, () => {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`);
})
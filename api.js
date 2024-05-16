const express = require('express');
const path = require('path');
const fs = require('fs');
const server = express();
const allMaps = require('./src/data/maps.json')
const port = 3000

server.get('/maps', (req, res) => {
    return res.json(allMaps);
})

server.get('/maps/:id', (req, res) => {
    const mapId = req.params.id;
    const map = allMaps.find(map => map.id.toString() === mapId.toString());

    if (!map) {
        return res.status(404).json({ error: 'Mapa não encontrado' });
    }

    return res.json(map);
});

const mapsDir = path.join(__dirname, 'assets', 'maps');
const flagsDir = path.join(__dirname, 'assets', 'flags');

server.get('/images/maps/:imageName', (req, res) => {
    const imageName = req.params.imageName + '.png';
    const imagePath = path.join(mapsDir, imageName);

    // Verifica se o arquivo existe
    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    // Envia a imagem como resposta
    res.sendFile(imagePath);
});

server.get('/images/flags/:imageName', (req, res) => {
    const imageName = req.params.imageName + '.png';
    const imagePath = path.join(flagsDir, imageName);

    // Verifica se o arquivo existe
    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    // Envia a imagem como resposta
    res.sendFile(imagePath);
});

server.listen(port, () => {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`);
})
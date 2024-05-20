const express = require('express');
const path = require('path');
const fs = require('fs');
const server = express();
const allMaps = require('./src/data/maps.json')
const allOperators = require('./src/data/operators.json')
const port = 4000

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
    // Pega os parâmetros de query 'limit' e 'page'
    const limit = parseInt(req.query.limit) || 10; // Define um valor padrão para 'limit'
    const page = parseInt(req.query.page) || 1; // Define um valor padrão para 'page'

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const totalPages = Math.ceil(allOperators.length / limit)

    const nextPage = page < totalPages ? page + 1 : null
    const paginatedOperators = allOperators.slice(startIndex, endIndex);

    if (paginatedOperators.length === 0) {
        return res.status(404).json({ error: 'No operators found' });
    }
    // Cria um objeto para a resposta com os operadores paginados e metadados sobre a paginação
    const response = {
        page,
        nextPage,
        limit,
        totalOperators: allOperators.length,
        totalPages,
        operators: paginatedOperators
    };

    res.json(response);
});

server.get('/allOperators', (req, res) => {
    res.json(allOperators);
});

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
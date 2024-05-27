const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const fs = require('fs');
const nfts = require('./scripts/nfts');
const userRoutes = require('./routes/user.js');
const saleRoutes = require('./routes/sale.js');
const gatoRoutes = require('./routes/gato.js');
const bebidaRoutes = require('./routes/bebida.js');
const ticketRoutes = require('./routes/ticket.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Esto relaciona nuestra '/api' con las otras partes de los comandos
app.use('/api', userRoutes);
app.use('/api', saleRoutes);
app.use('/api', gatoRoutes);
app.use('/api', bebidaRoutes);
app.use('/api', ticketRoutes);

// Para el CSS, HTML y otros archivos estáticos
app.use(express.static("page"));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

// Ruta para la página principal (Gatitos.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page/Gatitos.html'));
    console.log("Bienvenido a la página de Gatitos");
});

// Ruta para la página de Tickets
app.get('/tickets', (req, res) => {
    res.sendFile(path.join(__dirname, 'page/Tickets.html'));
    console.log("Bienvenido a la página de Tickets");
});

// Ruta para la página de Bebidas
app.get('/bebidas', (req, res) => {
    res.sendFile(path.join(__dirname, 'page/Bebidas.html'));
    console.log("Bienvenido a la página de Bebidas");
});

// Ruta para la subida de NFTs
app.post('/uploadNFT', upload.single('image'), (req, res) => {
    console.log("Esto debería subir un NFT, muy mal");
    const image = req.file;
    const { name, description } = req.body;
    const destinationPath = `uploads/${image.originalname}`;
    fs.rename(image.path, destinationPath, async (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error saving image');
        } else {
            var result = await nfts.createNFT({
                imageRoute: destinationPath,
                name: name,
                description: description
            });
            console.log(result);
            res.redirect(`https://sepolia.etherscan.io/tx/${result}`);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

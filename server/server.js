const express = require('express')
const path = require('path')

const app = express();

// Configuração dos protocolos
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Configura para encontrar o caminho dos arquivos front
app.use(express.static(path.join(__dirname, 'server')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


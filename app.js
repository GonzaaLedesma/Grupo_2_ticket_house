const express =require ('express');
const path = require('path')
const rutasUsuario = require('./routes/usuario')
const rutasProductos = require('./routes/producto')
const rutasMain = require('./routes/main')
const rutasAdministrador = require('./routes/administrador')
const app = express();

const publicPath = path.resolve(__dirname, './public')

app.use(express.static(publicPath));

app.listen(3000,()=>{
    console.log("Servidor en puerto 3000");
});

app.use('/', rutasMain);

app.use('/usuario', rutasUsuario);

app.use('/producto', rutasProductos);

app.use('/administrador', rutasAdministrador);

app.set('view engine', 'ejs');

app.set('views', './src/views');

// app.set('products', './src/views/products');

// app.set('users', './src/views/users');

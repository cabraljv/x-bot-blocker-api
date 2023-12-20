const express = require('express');
const routes = require('./router');

const app = express();
const path = require('path')

// fix cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


app.use(express.json());
const cacheTime = 600000;

app.use('/static', express.static(path.join(__dirname, 'static'), {
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, max-age=0');
      res.setHeader('Cache-Control', `public, max-age=${cacheTime / 1000}`);
    }
}));

app.use(routes);
// Aqui você vai adicionar os endpoints e a lógica do worker

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

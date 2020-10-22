import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';

import { App } from './App';
import '../Password/style.css';

const server = express();

server.use(express.static('.'));

server.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>react-form-with-constraints server-side rendering example</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <div id="app">${renderToString(<App />)}</div>
        <script src="browser.js"></script>
      </body>
    </html>
  `);
});

server.listen(8080);

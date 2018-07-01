module.exports = {
  launch: {
    // headless: false,
    // devtools: true,
    // slowMo: 100 // Slow down by 100ms
  },
  server: {
    command: 'node_modules/.bin/http-server build -p 8080',
    port: 8080
  }
};

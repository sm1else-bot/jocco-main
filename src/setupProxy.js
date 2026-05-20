const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/lava',
    createProxyMiddleware({
      target: 'https://api.lava.so/v1',
      changeOrigin: true,
      pathRewrite: { '^/api/lava': '' },
    })
  );
};

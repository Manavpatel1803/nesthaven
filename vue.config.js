const Dotenv = require('dotenv-webpack');

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type =>
      addStyleResource(config.module.rule('scss').oneOf(type))
    );
  },
  configureWebpack: {
    plugins: [
      new Dotenv(), // Load environment variables from .env file
    ],
  },
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      },
    },
  },
};

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        './src/assets/nicepage.css',
      ],
    });
}

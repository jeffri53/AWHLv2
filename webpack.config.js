const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.ts', // точка входа в исходники
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'), // папка сборки
    publicPath: '/AWHLv2/', // для GitHub Pages
  },
  mode: 'production', // убирает предупреждение
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser',
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
  ],
}; // <- убедись, что эта закрывающая фигурная скобка и точка с запятой на месте

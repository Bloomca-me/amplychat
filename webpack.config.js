const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader')
const path = require('path');

const DEV = process.env.NODE_ENV !== 'production';

const devPlugins = [
  new CheckerPlugin()
];
const productionPlugins = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify('production')
  })
];

module.exports = {
  entry: './client/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'vue$': 'vue/dist/vue.common.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.sass$/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [].concat(DEV ? devPlugins : productionPlugins)
};
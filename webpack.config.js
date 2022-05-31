const path = require('path');
const json5 = require('json5');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = (env, args) => {
  // NOTE: When adding an entry, add the corresponding source map file to
  // web_accessible_resources in //templates/manifest.gjson.
  let entry = {
    background: './src/background.ts',
    options: './src/options/options.js',
  };

  let outputPath = path.join(__dirname, 'dist', env.browser_target);

  let preprocessorLoader = {
    loader: 'webpack-preprocessor-loader',
    options: {
      params: {
        browser_target: env.browser_target,
        production: args.mode == 'production',
      },
    },
  };

  return {
    entry,
    output: {
      filename: '[name].bundle.js',
      path: outputPath,
      clean: true,
    },
    plugins: [
      new WebpackShellPluginNext({
        onBuildEnd: {
          scripts:
              ['genmanifest -template templates/manifest.gjson -dest ' +
               path.join(outputPath, 'manifest.json') + ' ' +
               env.browser_target]
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'src/icons'),
            to: path.join(outputPath, 'icons'),
          },
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'src/static'),
            to: outputPath,
            globOptions: {
              ignore: ['**/OWNERS', '**.md'],
            }
          },
        ]
      }),
      new CleanTerminalPlugin(),
    ],
    devtool: (args.mode == 'production' ? 'source-map' : 'inline-source-map'),
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
    },
    module: {
      rules: [
        {
          test: /\.json5$/i,
          type: 'json',
          parser: {
            parse: json5.parse,
          },
          use: [
            preprocessorLoader,
          ],
        },
        {
          test: /\.js$/i,
          use: [
            {loader: 'source-map-loader'},
            preprocessorLoader,
          ],
        },
        {
          test: /\.tsx?$/,
          use: [
            {loader: 'ts-loader'},
            preprocessorLoader,
          ]
        },
      ]
    },
  };
};

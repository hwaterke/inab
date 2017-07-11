// This file is used by react-app-rewired to override the webpack config of react-script.

function rewireBabel(config) {
  const babelOptions = config.module.rules.find(
    conf => conf.loader && conf.loader.includes('babel-loader')
  ).options;

  const babelrc = require(babelOptions.presets[0]);

  babelrc.plugins = ['transform-decorators-legacy'].concat(babelrc.plugins || []);

  babelOptions.presets = babelrc;

  return config;
}

function rewireSass(config) {
  // Exclude scss files from the file-loader
  config.module.rules
    .find(conf => conf.loader && conf.loader.includes('file-loader'))
    .exclude.push(/\.scss$/);

  // Extract config for CSS
  const cssLoader = config.module.rules.find(
    conf => conf.test && String(conf.test) === String(/\.css$/)
  );

  // Add loader for scss files
  config.module.rules.push({
    test: /\.scss$/,
    use: [...(cssLoader.loader || cssLoader.use), 'sass-loader']
  });

  return config;
}

module.exports = function override(config, env) {
  rewireBabel(config, env);
  rewireSass(config, env);
  return config;
};

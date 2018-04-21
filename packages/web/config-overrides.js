// This file is used by react-app-rewired to override the webpack config of react-script.
const rewired = require('react-app-rewired');

function rewireBabel(config) {
  return rewired.injectBabelPlugin('transform-decorators-legacy', config);
}

function rewireSass(config) {
  const cssLoader = rewired.getLoader(
    config.module.rules,
    rule => rule.test && String(rule.test) === String(/\.css$/)
  );

  const sassLoader = {
    test: /\.scss$/,
    use: [...(cssLoader.loader || cssLoader.use), 'sass-loader']
  };

  const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf;
  oneOf.unshift(sassLoader);

  return config;
}

module.exports = function override(config, env) {
  rewireBabel(config, env);
  rewireSass(config, env);
  return config;
};

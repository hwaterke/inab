// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import {chalkProcessing} from './chalkConfig';

import url from 'url';
import proxy from 'proxy-middleware';

// Proxy options.
const proxyOptions = url.parse(`http://${process.env.API_HOST || 'localhost'}:8080/api`);
proxyOptions.route = '/api';

/* eslint-disable no-console */

console.log(chalkProcessing('Opening production build...'));

// Run Browsersync
browserSync({
  port: 3000,
  ui: {
    port: 3001
  },
  server: {
    baseDir: 'dist'
  },

  files: [
    'src/*.html'
  ],

  middleware: [historyApiFallback(), proxy(proxyOptions)]
});

const mix = require('laravel-mix');
const fs  = require('fs-extra');

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css').react();
mix.after(webpackStats => {
    fs.copy('./public/js', './public/public/js')
    .then(() => console.log('Files copied successfully!'))
    .catch(err => console.error(err));
});

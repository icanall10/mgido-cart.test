const mix = require('laravel-mix');

mix.less('resources/less/cart.less', 'public/css/');

mix.scripts([
    'resources/js/cart.js'
], 'public/js/cart.js');


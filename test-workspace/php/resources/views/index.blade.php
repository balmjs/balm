<?php
require_once(PUBLIC_PATH . '/helpers.php');

use \App\Helpers as helpers;
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#2196F3" />
    <title>Hello BalmJS - PHP</title>
    <link
      rel="shortcut icon"
      type="image/x-icon"
      href="/favicon.ico"
    />
    <link rel="stylesheet" href="<?php echo helpers\balm('css/app.css', 'web'); ?>" />
  </head>

  <body>
    <div id="app">
      <span>Hello</span>
      <img src="<?php echo helpers\balm('img/logo.svg', 'web'); ?>" alt="BalmJS" />
      <a href="//balmjs.com/">BalmJS</a>
    </div>
    <script src="<?php echo helpers\balm('js/app.js', 'web'); ?>"></script>
  </body>
</html>

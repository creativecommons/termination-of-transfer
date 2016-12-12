<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

      <title>Termination of Transfer: <?= $page; ?></title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

<?php
if (isset($header_extra)) {
    echo $header_extra;
}
?>
  </head>
  <body>
    <div class="container">

       <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>

            <a class="navbar-brand" href="#">Termination of Transfer Tool</a>
          </div>
          <div class="navbar-collapse collapse" id="navbar">
            <!--<ul class="nav navbar-nav">
            </ul>-->
            <ul class="nav navbar-nav navbar-right">
              <li<?php if ($page == 'Introduction') echo ' class="active"'; ?>><a href="./">Intro<?php if ($page == 'Welcome') echo ' <span class="sr-only">(current)</span>'; ?></a></li>
              <li<?php if ($page == 'Overview') echo ' class="active"'; ?>><a href="./overview.php">Overview<?php if ($page == 'Overview') echo ' <span class="sr-only">(current)</span>'; ?></a></li>
              <li<?php if ($page == 'Documents') echo ' class="active"'; ?>><a href="./documents.php">Useful Documents<?php if ($page == 'Documents') echo ' <span class="sr-only">(current)</span>'; ?></a></li>
              <li<?php if ($page == 'Glossary') echo ' class="active"'; ?>><a href="./glossary.php">Glossary<?php if ($page == 'Glossary') echo ' <span class="sr-only">(current)</span>'; ?></a></li>
              <li<?php if ($page == 'FAQ') echo ' class="active"'; ?>><a href="./faq.php">FAQ<?php if ($page == 'FAQ') echo ' <span class="sr-only">(current)</span>'; ?></a></li>
               <li<?php if ($page == 'Questionnaire') echo ' class="active"'; ?>><a href="./questionnaire.php">Start the Tool<?php if ($page == 'Questionnaire') echo ' <span class="sr-only">(current)</span>'; ?></a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div><!--/.container-fluid -->
      </nav>

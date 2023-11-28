<?php
    session_start();

    if($_SESSION["auth"] != true) {
        header("HTTP/1.0 403 Forbidden");
        die;
    }

    $_POST = json_decode(file_get_contents('php://input'), true);

    $newFile = "../../" . $_POST["name"] . ".html";
    $template = $_POST["template"];

    if(file_exists($newFile)) {
        header("HTTP/1.0 400 Bad request");
    } else {

        $fileTemplate = file_get_contents('../../templates/' . $template, true);

        fopen($newFile, 'w'); // fopen - что нужно сдлеать с файлом; 1 - путь к файлу, 2 - что с ним нужно сделать (w - открыть/создать)

        $fileHandler = fopen($newFile, 'w');
        $data = '
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Название фалйа</title>
            </head>
            <body>
                
            </body>
            </html>
        ';

        fwrite($fileHandler, $fileTemplate);
        fclose($fileHandler);

    }

?>
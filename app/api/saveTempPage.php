<?php

    $_POST = json_decode(file_get_contents('php://input'), true);

    $newFile = "../../temp-v345453430.html";

    if($_POST["html"]) {
        file_put_contents($newFile, $_POST["html"]);
    } else {
        header("HTTP/1.0 400 Bad request");
    }

?>
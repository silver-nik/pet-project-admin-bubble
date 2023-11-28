<?php


    $file = "../../temp-v345453430.html";

    if(file_exists($file)) {
        unlink($file);
    } else {
        header("HTTP/1.0 400 Bad request");
    }

?>
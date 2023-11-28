<?php

    session_start();

    if($_SESSION["auth"] != true) {
        header("HTTP/1.0 403 Forbidden");
        die;
    }

    if(file_exists($_FILES["image"]["tmp_name"]) && is_uploaded_file($_FILES["image"]["tmp_name"])) {

        $fileExt = explode("/", $_FILES["image"]["type"])[1];
        $fileName = "img-" . uniqid() . "." . $fileExt;

        if(!is_dir("../../img/Downloads/")) {
            mkdir("../../img/Downloads/");
        }

        move_uploaded_file($_FILES["image"]["tmp_name"], "../../img/Downloads/" . $fileName);

        echo json_encode( array("src" => $fileName) );
    }

?>
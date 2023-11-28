<?php
        
    session_start();

    if($_SESSION["auth"] != true) {
        header("HTTP/1.0 403 Forbidden");
        die;
    }

    $_POST = json_decode(file_get_contents('php://input'), true);

    $path = "../../img";
    $folderName = $_POST["folderName"];
    $imageName = $_POST["imageName"];



    $folders = array();
    $filesList = array();
    $uploadDate;
    $extension;
    $fileSize;
    $mimeType;


    if (is_dir($path)) {
    
        $files = scandir($path);
        foreach ($files as $file) {
            if ($file != '.' && $file != '..' && is_dir($path.'/'.$file)) {
                $folders[] = $file;
            }
        }        

    }

    if (is_dir($path . '/' . $folderName)) {

        $filesList2 = scandir($path . '/' . $folderName);

        foreach ($filesList2 as $file2) {
            
            if ($file2 != '.' && $file2 != '..') {
                $filesList[] = $path . '/' . $folderName . '/' . $file2;

                if ($file2 == $imageName) {
                    
                    $pathTemp = $path . '/' . $folderName . '/' . $imageName;

                    $uploadDate = date('d.m.Y', filectime($pathTemp));
    
                    $mimeType = mime_content_type($pathTemp); 

                    $fileSize = filesize($pathTemp);

                }

            } 

        }

    }


    echo json_encode(array(
        "files" => $filesList,
        "folders" => $folders,
        "timeLoad" => $uploadDate,
        "type" => $mimeType,
        "size" => $fileSize
    ));


?>
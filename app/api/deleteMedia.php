<?php

    session_start();

    if($_SESSION["auth"] != true) {
        header("HTTP/1.0 403 Forbidden");
        die;
    }

    $_POST = json_decode(file_get_contents('php://input'), true);

    $image = $_POST["imageName"];
    $folder = $_POST["folder"];


    $path = "../../img/" . $folder . '/' . $image; 

    $folders = array();
    $filesList = array();

    if (file_exists($path)) {
    
        unlink($path);
        
        echo 'Успешно удален';

    }

    // echo json_encode(array(
    //     "image" => $filesList,
    //     "folders" => $folders
    // ));

    // if(file_exists($file)) {

    //     if(empty($_POST['type'])) {
    //         unlink($file);
    //     } else {

    //         foreach( $backups as $key => $value )
    //         {
    //             if($value['file'] === $_POST['name'])
    //                 {

    //                     unset($backups[$key]);
    //                     unlink($file);

    //                     // $array = array_values(array_filter($backups, function($key, $value) {
    //                     //     return $backups[$value];
    //                     // }, ARRAY_FILTER_USE_BOTH));
            
    //                     // var_dump($array);

    //                     // var_dump($backups[$key]);

    //                     break;
    //                 }
    //         }

    //         $backups = array_values($backups);

    //         $json = json_encode($backups, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    //         file_put_contents('../backups/backups.json', $json);
    //         unset($backups);
    //     }

    // } else {
    //     header("HTTP/1.0 400 Bad request");
    // }


?>
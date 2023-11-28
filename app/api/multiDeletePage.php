<?php

    session_start();

    if($_SESSION["auth"] != true) {
        header("HTTP/1.0 403 Forbidden");
        die;
    }

    $_POST = json_decode(file_get_contents('php://input'), true);
    
    $array = $_POST["pageArray"];
    $backupsArray = $_POST["backupArr"];

    if(count($array) > 0) {
        foreach($array as $key => $value )
            {

                $file = "../../" . $value;

                if(file_exists($file)) {
                    unlink($file);
                }
            
            }
    }

    if(count($backupsArray) > 0) {
        foreach($backupsArray as $key => $value )
            {

                $file = "../backups/" . $value;
                $backups = json_decode(file_get_contents("../backups/backups.json"), true);

                if(file_exists($file)) {
                    
                    foreach( $backups as $key => $value2 )
                        {
                            if($value2['file'] === $value)
                                {

                                    unset($backups[$key]);
                                    unlink($file);

                                    break;
                                }
                        }

                        $backups = array_values($backups);

                        $json = json_encode($backups, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                        file_put_contents('../backups/backups.json', $json);
                        unset($backups);

                }
                
            }
    }



?>
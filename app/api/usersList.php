<?php
        
    session_start();

    if($_SESSION["auth"] != true) {
        header("HTTP/1.0 403 Forbidden");
        die;
    }

    $settings = json_decode(file_get_contents('./settings.json'), true);
    $user = null;
    $usersList = array();

        foreach( $settings as $key => $values )
            {

                foreach( $values as $key => $value) {

                    if($value["role"] !== 'moderator' && $value["id"])
                        {

                            $usersList[] = $value;

                        }
                        
                }

            }

        
        echo json_encode(array(
            "users" => $usersList
        ));


?>
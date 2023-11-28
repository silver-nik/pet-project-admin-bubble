<?php

    session_start();

    $config = parse_ini_file('config.conf', true);

    $_POST = json_decode(file_get_contents('php://input'), true);

    $dta = $config['database']['dta'];
    $pwd = $_POST['pwd'];
    $id = $_POST['id'];
    $match = false;

    $pwd_peppered = hash_hmac("sha256", $pwd, $dta);
    $pwd_hashed;

    $settings = json_decode(file_get_contents('./settings.json'), true);

    foreach( $settings as $key => $values ) {
      
        foreach( $values as $value) {

            if($id === $value["id"]) {

                $pwd_hashed = $value["password"];

                $match = true;

                break;
            }
            
        }

        if($match) {
            break;
        }

    }

    if(isset($pwd_hashed)) {

        if(password_verify($pwd_peppered, $pwd_hashed)) {
            echo json_encode(array(
                "message" => "ok"
            ));
        } else {
            echo json_encode(array(
                "w" => $pwd_peppered,
                "c" => $pwd_hashed,
                "message" => "401"
            ));
        }

    }
    else {
        echo "Password not found";
    }
                            

?>
<?php

    session_start();

    require __DIR__ . '/vendor/autoload.php';

    use \Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    $config = parse_ini_file('config.conf', true);

    $_POST = json_decode(file_get_contents('php://input'), true);

    $dta = $config['database']['dta'];

    $pwd = $_POST['password'];
    $pwd_peppered = hash_hmac("sha256", $pwd, $dta);
    $login = $_POST['login'];
    $user = null;

    if($pwd && $login) {

        $settings = json_decode(file_get_contents('./settings.json'), true);

        foreach( $settings as $key => $values )
            {

                
                foreach( $values as $key => $value)
                    {

                        if(password_verify($pwd_peppered, $value['password']) && $login == $value['login'])
                            {

                                $user = $value;

                                break;
                            }
                        else {

                                next($values);
                        }
                        
            
                }


            }

            if ($user) {

                $secretKey = 'q3YWC6B3Cf6Ep46mnssRTkdT6m8SGaExyZtcgXhqPJcrMpqKUB99Fr2XnTeqL5FU4GDg2cYpP3PbvrXLteuHFc7ucGcNTLRGsm9Km93dTz7QaQ9RJbeAY3nprWZqqDZCQJpDy7y5wdzhZsc6yv5MqRzHs7DjEAS5GAdsVkw4mAfvaDyGGjuLFR5syuU2uRAKaQk4Na8ct8XK29ejbcCktSEv9s6hhn4rKL8QPVMm2tv8hnBW5zYsg2bgWKKjyKg7';

                $secret_key = $secretKey;
                $issuer_claim = "localhost"; 
                $audience_claim = "localhost"; 
                $issuedat_claim = time(); 
                $notbefore_claim = $issuedat_claim + 10; 
                $expire_claim = $issuedat_claim + 3600; 
            
                $token = array(
                    "iss" => $issuer_claim,
                    "aud" => $audience_claim,
                    "iat" => $issuedat_claim,
                    "nbf" => $notbefore_claim,
                    "exp" => $expire_claim,
                    "data" => array(
                        "auth" => 'true',
                        "login" => $user['login'],
                        "id" => $user['id'],
                        "role" => $user['role'],
                        "name" => $user['name']
                    )
                );
                $jwt = JWT::encode($token, $secret_key, 'HS256');
            
                echo json_encode(array(
                    "message" => "Авторизация прошла успешно",
                    "jwt_token" => $jwt
                ));

                $_SESSION["auth"] = true;
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "ERrr"));
            }


    } else {
        header("HTTP/1.0 400 Bad request");
    }


?>
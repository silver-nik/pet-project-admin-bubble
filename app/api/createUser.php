<?php

    session_start();

    $config = parse_ini_file('config.conf', true);

    if($_POST['login'] && $_POST['password'] && $_POST['gender']) {

        $sessionToken = bin2hex(random_bytes(16));

        $dta = $config['database']['dta'];
        $pwd = $_POST['password'];
        $pwd_peppered = hash_hmac("sha256", $pwd, $dta);
        $pwd_hashed = password_hash($pwd_peppered, PASSWORD_ARGON2ID);
        
        if (file_exists('./settings.json')) {
            
                $data = json_decode(file_get_contents('./settings.json'), true);

                if ($data === null) {
                    throw new Exception("Ошибка при создании пользователя");
                }
                
                foreach ($data['users'] as $user) {
                    if ($user['login'] === $_POST['login']) {
                        throw new Exception('incorrect login');
                        break;
                    }
                }
                
                $new_user = array(
                    "password" => $pwd_hashed,
                    "login" => $_POST['login'],
                    "sex" => $_POST['gender'],
                    "id" => $sessionToken,
                    "user_token" => $sessionToken,
                    "role" => "user",
                    "name" => "Никита Admin",
                    "email" => "example@mail.ru",
                    "phoneNumber" => "+79343336789",
                    "country" => "Russia",
                    "location" => "Vladivostok", 
                    "status" => "active",
                    "language" => "ru",
                    "position" => "Team Lead",
                    "bio" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                );
        
                array_push($data['users'], $new_user);
        
                $users = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        
                $file = fopen('./settings.json', 'w');
        
                fwrite($file, $users);
        
                fclose($file);

                echo $users;

        } else {
            echo "Файл не найден";
        }

    }

?>
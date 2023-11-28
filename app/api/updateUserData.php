<?php

    session_start();

    $config = parse_ini_file('config.conf', true);

    $_POST = json_decode(file_get_contents('php://input'), true);

    $dta = $config['database']['dta'];
    $pwd = $_POST['oldPwd'];
    $newPwd = $_POST['newPwd'];
    $notificationsSettings = $_POST['notifications'];
    $id = $_POST['id'];

    // if (file_exists('./settings.json') && $pwd && $newPwd) {

    //     $pwd_peppered = hash_hmac("sha256", $pwd, $dta);

    //     $data = json_decode(file_get_contents('./settings.json'), true);

    //     if ($data === null) {
    //         throw new Exception("Ошибка при редактировании пользователя");
    //     }
                            
    //     foreach ($data['users'] as &$user) {
    //         if($user['id'] == $id) {

    //             if(password_verify($pwd_peppered, $user['password'])) {

    //                 $new_pwd_peppered = hash_hmac("sha256", $newPwd, $dta);
    //                 $new_pwd_hashed = password_hash($new_pwd_peppered, PASSWORD_ARGON2ID);
                    
    //                 $user['password'] = $new_pwd_hashed;

    //             }

    //         }   
    //     }

    //     $newContents = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    //     file_put_contents('./settings.json', $newContents);

    //     echo "Данные пользователя успешно обновлены";

    // } else if (file_exists('./settings2.json') && $notificationsSettings) {

    //     $data2 = json_decode(file_get_contents('./settings2.json'), true);

    //     if (array_keys($notificationsSettings) === array_keys($data2['notifications'])) {
    //         foreach ($data2['notifications'] as &$notification) {
    //             if ($notification['id'] === $id) {
    //                 foreach ($notificationsSettings as $key => $item) {
    //                     $names = $item['name'];
    //                     foreach ($item as $key => $val) {
    //                         if ($key !== 'name') {
    //                             if ($notification[$names][$key] != $item[$key]) {
    //                                 $notification[$names][$key] = $item[$key];
    //                             }
    //                         }
    //                     }
    //                 }
    //                 break;
    //             }
    //         }

    //         echo 200;

    //         $json = json_encode($data2, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    //         file_put_contents('./settings2.json', $json);
    //     } else {
    //         echo "ключи не совпадают";
    //     } 

    // }
    
    
    // else {
    //     echo "ЧТо-то пошло не так";
    // }


    // снизу код editor-user.js

    // session_start();

    if (file_exists('./settings.json')) {
                
        $data = json_decode(file_get_contents('./settings.json'), true);

        if ($data === null) {
            throw new Exception("Ошибка при редактировании пользователя");
        }
        
        foreach ($data['users'] as &$user) {
            if ($user['id'] === $_POST['id']) {
 
                foreach(array_keys($_POST) as $key){
                    if($key !== 'auth' && $key !== 'role' && $key !== 'id') {
                        $user[$key] = $_POST[$key];
                    }
                }

            }   
        }

        $newContents = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        file_put_contents('./settings.json', $newContents);

        echo "Данные пользователя успешно обновлены";

    } else {
        echo "ЧТо-то пошло не так";
    }

?>

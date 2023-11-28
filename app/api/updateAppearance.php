<?php

    session_start();

    $_POST = json_decode(file_get_contents('php://input'), true);

    $id = $_POST['id'];
    $color = $_POST['currentAccentColor'];
    $themeID = $_POST['currentTheme'];

    if (file_exists('./settings.json') && $id) {

        $data = json_decode(file_get_contents('./settings.json'), true);
        $visualSettings = json_decode(file_get_contents('./visual.json'), true);

        if ($data === null) {
            throw new Exception("Ошибка");
        }
                            
        foreach ($data['users'] as &$user) {
            if($user['id'] == $id) {

                foreach ($visualSettings['accentColors'] as $visual) {

                    if(strtolower($visual['color']) == strtolower($color)) {
                        $user['accentColors'] = $visual;
                    }

                }

                foreach ($visualSettings['themes'] as $theme) {

                    if($theme['id'] == $themeID) {
                        $user['theme'] = $theme;
                    }

                }
                
                $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                file_put_contents('./settings.json', $json);   

            } 
        } 

    }

?>
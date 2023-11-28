<?php

    $notifications = json_decode(file_get_contents('./notifications-data.json'), true);
    $_POST = json_decode(file_get_contents('php://input'), true);

    $id = $_POST['id'];
    
    foreach ($notifications['notifications'] as &$notification) {
        if($notification['id'] === $id) {
            foreach($notification as $type => $value) {
                if($type !== 'id') {
                    $notification[$type]['read'] = true; 
                }
            }
        }
    }

    file_put_contents('./notifications-data.json', json_encode($notifications, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
?>
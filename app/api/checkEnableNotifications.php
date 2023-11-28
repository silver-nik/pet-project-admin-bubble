<?php

    $notifications = json_decode(file_get_contents('./notifications-data.json'), true);
    $permissions = json_decode(file_get_contents('./settings2.json'), true);
    $_POST = json_decode(file_get_contents('php://input'), true);

    $id = $_POST['id'];

    $allowed_push_notifications = [];
    $allowed_email_notifications = [];

    foreach($permissions['notifications'] as $key => $innerKey) {
        if($innerKey['id'] === $id) {

            foreach ($notifications as $type => $notification) {
                foreach($notification as $key => $value) {

                    if($value['id'] === $id) {

                        foreach($value as $type => $a) {
                            if($type !== 'id') {

                                // $json = '{
                                //     "date": "2023-07-16"
                                //   }';
                                  
                                //   $data = json_decode($json, true);
                                //   $date = new DateTime($data['date']);
                                //   $today = new DateTime();
                                  
                                //   $interval = $today->diff($date);
                                //   $days = $interval->format('%a');
                                  
                                  if ($days == 1) {
                                      $output = "1 day ago";
                                  } elseif ($days > 1) {
                                      $output = $days . " days ago";
                                  } else {
                                      $output = "Today";
                                  }
                                  
                                //   echo $output;

                                if (isset($innerKey['email-notification'][$type]) && $innerKey['email-notification'][$type] && $value[$type]['read'] !== 'false') {
                                    $allowed_email_notifications[$type]['notificationName'] = 'email-notification';
                                    $allowed_email_notifications[$type]['title'] = $value[$type]['title'];
                                    $allowed_email_notifications[$type]['body'] = $value[$type]['body'];

                                    $date = new DateTime($value[$type]['date']);
                                    $today = new DateTime();
                                    
                                    $interval = $today->diff($date);
                                    $days = $interval->format('%a');

                                    if ($days == 1) {
                                        $output = "1 день назад";
                                    } elseif ($days > 1) {
                                        $output = $days . " дней назад";
                                    } else {
                                        $output = "Сегодня";
                                    }

                                    $allowed_email_notifications[$type]['date'] = $output; 

                                }
                                if (isset($innerKey['push-notification'][$type]) && $innerKey['push-notification'][$type] && $value[$type]['read'] != true) {
                                    $allowed_push_notifications[$type]['notificationName'] = 'push-notification';
                                    $allowed_push_notifications[$type]['title'] = $value[$type]['title'];
                                    $allowed_push_notifications[$type]['body'] = $value[$type]['body'];

                                    $date = new DateTime($value[$type]['date']);
                                    $today = new DateTime();
                                    
                                    $interval = $today->diff($date);
                                    $days = $interval->format('%a');

                                    if ($days == 1) {
                                        $output = "1 день назад";
                                    } elseif ($days > 1) {
                                        $output = $days . " дней нзад";
                                    } else {
                                        $output = "Сегодня";
                                    }

                                    $allowed_push_notifications[$type]['date'] = $output; 

                                }

                            }

                        }
                    }
                }

            }

        }
    }

    echo json_encode($allowed_push_notifications);
    // echo json_encode(array(
    //    'push' => $allowed_push_notifications,
    // //    "email" => $allowed_email_notifications
    // ));

?>
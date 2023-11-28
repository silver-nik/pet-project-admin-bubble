<?php

    require __DIR__ . '/vendor/autoload.php';

    use \Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    $secretKey = 'q3YWC6B3Cf6Ep46mnssRTkdT6m8SGaExyZtcgXhqPJcrMpqKUB99Fr2XnTeqL5FU4GDg2cYpP3PbvrXLteuHFc7ucGcNTLRGsm9Km93dTz7QaQ9RJbeAY3nprWZqqDZCQJpDy7y5wdzhZsc6yv5MqRzHs7DjEAS5GAdsVkw4mAfvaDyGGjuLFR5syuU2uRAKaQk4Na8ct8XK29ejbcCktSEv9s6hhn4rKL8QPVMm2tv8hnBW5zYsg2bgWKKjyKg7';

    $token = $_SERVER['HTTP_AU'];

    if (!$token) {
        echo json_encode(array("message" => "Токен отсутствует"));
        http_response_code(401);
        exit();
    } else {
        verifyToken($token, $secretKey);
        if(verifyToken($token, $secretKey)) {
            getUserDataFromToken($token);
        } else {
            echo 'Invalid token';
        }
    }

    function verifyToken($token, $secretKey) {

        $tokenBearer = str_replace('Bearer ', '', $token);

        $tokenParts = explode('.', $tokenBearer);
        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $payloadData = json_decode($payload, true);
        $signature = base64_decode($tokenParts[2]);
    
        try {
            JWT::$leeway = 60; // $leeway in seconds
            $tokenDecode = JWT::decode($tokenBearer, new Key($secretKey, 'HS256'));
        } catch (Exception $e) {
            
            http_response_code(401);
            echo 'Выброшено исключение: ',  $e->getMessage();
            exit();
        }
        
        // Проверяем, что токен не истек
        if ($tokenDecode->exp < time()) {
            echo json_encode(array("message" => "Токен истек"));
            http_response_code(401);
            exit();
        }
    
        $headerData = json_decode($header, true);
        
        if ($headerData['alg'] !== 'HS256') {
            // Алгоритм подписи неправильный, токен недействителен
            http_response_code(401);
            echo json_encode(['message' => 'Invalid token']);
            exit;
        }
    
        // Проверяем наличие необходимых прав доступа в полезной нагрузке токена
        if (!isset($payloadData['data'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Insufficient permissions']);
            exit;
        }

        $_SESSION["auth"] = true;

        return true;

    }

    function getUserDataFromToken($token) {
        $tokenBearer = str_replace('Bearer ', '', $token);
        $tokenParts = explode('.', $tokenBearer);
        $payload = base64_decode($tokenParts[1]);
        $payloadData = json_decode($payload, true);

        $data = json_decode(file_get_contents('./settings.json'), true);
        $colors;
        $theme;
        $name;

        foreach ($data['users'] as $user) {
            if($user['id'] == $payloadData['data']['id']) {

                $colors = $user['accentColors'];
                $theme = $user['theme'];
                $name = $user['name'];

            } 
        } 

        echo json_encode(array(
            "auth" => $payloadData['data']['auth'],
            "user_id" => $payloadData['data']['id'],
            "role" => $payloadData['data']['role'],
            "colours" => $colors,
            "theme" => $theme,
            "name" => $name
        ));
    }

?>
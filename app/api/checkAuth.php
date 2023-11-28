<?php

    session_start();

    if ($_SESSION["auth"] == true && $_SESSION["role"]) {
        echo json_encode( array("auth" => true, "role" => $_SESSION["role"]) );
    } else {
        echo json_encode( array("auth" => false, "role" => '') );
    }

?>
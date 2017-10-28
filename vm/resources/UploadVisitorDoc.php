<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * 
 */
header('Content-type: text/json');
header('Content-type: application/json');
$upload_dir = "/wamp/www/vManager-UI/upload/";
if (isset($_FILES["file"])) {
    if ($_FILES["file"]["error"] > 0) {
        echo "Error: " . $_FILES["file"]["error"] . "<br>";
    } else {
        move_uploaded_file($_FILES["file"]["tmp_name"], $upload_dir . $_FILES["file"]["name"]);
        //echo json_encode($_FILES);
        $response = array (
            "fileName" => $_FILES["file"]["name"],
            "exception" => array(
              "code" => '',
              "message" => "",
              "status" => false  
            )
        );
        echo json_encode($response);
        exit;
    }
}

?>
<?php 

namespace Controllers;

class TareaController {
    public static function index() {

    }

    public static function crear() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            echo json_encode($_POST);
        }
    }

    public static function actualizar() {
        echo "Desde crear";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
        }
    }

    public static function eliminar() {
        echo "Desde crear";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
        }
    }
}
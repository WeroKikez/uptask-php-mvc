<?php 

namespace Controllers;

use MVC\Router;

class LoginController {
    public static function login( Router $router ) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo "desde POST";
        }

        // Render a la vista
        $router->render('auth/login', [
            'titulo' => 'Iniciar Sesion'
        ]);
    }

    public static function logout() {
        echo "desde logout";
    }

    public static function crear( Router $router ) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo "desde POST";
        }

        // Render a la vista
        $router->render('auth/crear', [
            'titulo' => 'Crea tu Cuenta'
        ]);
    }

    public static function olvide( Router $router ) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo "desde POST";
        }

        $router->render('auth/olvide', [
            'titulo' => 'Reestablece tu Password'
        ]);
    }

    public static function reestablecer() {
        echo "desde olvide";

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo "desde POST";
        }
    }

    public static function mensaje() {
        echo "desde mensaje";
    }

    public static function confirmar() {
        echo "desde confirmar";
    }
}
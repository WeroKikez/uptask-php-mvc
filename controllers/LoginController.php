<?php 

namespace Controllers;

use Model\Usuario;
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
        $usuario = new Usuario();
        $alertas = [];
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);

            $alertas = $usuario->validarNuevaCuenta();
        }

        // Render a la vista
        $router->render('auth/crear', [
            'titulo' => 'Crea tu Cuenta',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function olvide( Router $router ) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo "desde POST";
        }

        $router->render('auth/olvide', [
            'titulo' => 'Olvidé mi Password'
        ]);
    }

    public static function reestablecer( Router $router ) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo "desde POST";
        }

        $router->render('auth/reestablecer', [
            'titulo' => 'Reestablece tu Password'
        ]);
    }

    public static function mensaje( Router $router ) {
        $router->render('auth/mensaje', [
            'titulo' => 'Cuenta Creada'
        ]);
    }

    public static function confirmar( Router $router) {
        $router->render('auth/confirmar', [
            'titulo' => 'Confirma tu Cuenta'
        ]);
    }
}
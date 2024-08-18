<?php 

namespace Controllers;

use Classes\Email;
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

            if(empty($alertas)) {
                $existeUsuario = Usuario::where('email', $usuario->email);
                if($existeUsuario) {
                    Usuario::setAlerta('error', 'Ya existe un usuario con ese Email');
                    $alertas = $usuario->getAlertas();
                } else {
                    // Hashear el password
                    $usuario->hashPassword();

                    // Eliminar password2
                    unset($usuario->password2);

                    // Generar el token
                    $usuario->generarToken();

                    // Crear nuevo usuario
                    $resultado = $usuario->guardar();

                    // Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarConfirmacion();

                    if($resultado){
                        header('Location: /mensaje');
                    }
                }
            } 
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
        $token = s($_GET['token']);

        if(!$token) header('Location: /');

        // Encontrar al usuario
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            // Usuario no encontrado
            Usuario::setAlerta('error', 'Token no válido');
        } else {
            // Confirmar la cuenta
            $usuario->confirmado = 1;
            $usuario->token = null;
            unset($usuario->password2);

            // Guardar en la DB
            $usuario->guardar();

            Usuario::setAlerta('exito', 'Cuenta confirmada, ya puedes iniciar sesión');
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/confirmar', [
            'titulo' => 'Confirma tu Cuenta',
            'alertas' => $alertas
        ]);
    }
}
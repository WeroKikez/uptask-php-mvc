<?php 

namespace Controllers;

use Model\Proyecto;
use Model\Usuario;
use MVC\Router;

class DashboardController {

    public static function index( Router $router ) {
        session_start();

        isAuth();

        $proyectos = Proyecto::belongsTo('propietarioId', $_SESSION['id']);

        $router->render('dashboard/index', [
            'titulo' => 'Proyectos',
            'proyectos' => $proyectos
        ]);
    }

    public static function crear_proyecto( Router $router ) {
        session_start();

        isAuth();

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $proyecto = new Proyecto($_POST);

            // Validación
            $alertas = $proyecto->validarProyecto();

            if(empty($alertas)) {
                // Generar una URL única
                $proyecto->url = md5(uniqid());

                // Almacenar el creador del proyecto
                $proyecto->propietarioId = $_SESSION['id'];

                // Guardar el Proyecto
                $proyecto->guardar();

                // Redireccionar
                header('Location: /proyecto?id=' . $proyecto->url);
            }
        }

        $router->render('dashboard/crear-proyecto', [
            'titulo' => 'Crear Proyecto',
            'alertas' => $alertas
        ]);
    }

    public static function proyecto( Router $router ) {
        session_start();

        isAuth();

        $token = $_GET['id'];

        if(!$token) header('Location: /dashboard');
        
        // Revisar que la persona que visita el proyecto es quien lo creo
        $proyecto = Proyecto::where('url', $token);

        if($proyecto->propietarioId !== $_SESSION['id']) header('Location: /dashboard');

        $router->render('dashboard/proyecto', [
            'titulo' => $proyecto->proyecto
        ]);
    }

    public static function perfil( Router $router ) {
        session_start();

        isAuth();
        
        $alertas = [];
        $usuario = Usuario::find($_SESSION['id']);

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarPerfil();

            if(empty($alertas)) {
                // Guardar el usuario
                $usuario->guardar();

                Usuario::setAlerta('exito', 'Perfil actualizado correctamente');
                $alertas = $usuario->getAlertas();

                // Asignar el nombre nuevo a la barra
                $_SESSION['nombre'] = $usuario->nombre;
            }
        }

        $router->render('dashboard/perfil', [
            'titulo' => 'Mi Perfil',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }
}   
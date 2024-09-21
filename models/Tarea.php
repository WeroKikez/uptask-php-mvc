<?php 

namespace Model;

class Tarea extends ActiveRecord {
    protected static $tabla = 'tareas';
    protected static $columnasDB = ['id', 'nombre', 'estado', 'proyectoId'];

    // Cuando las variables son proteced, no se pueden acceder desde fuera de la clase
    // Buscar forma de acceder a ellas desde fuera de la clase sin cambiarlas a public
    public $id = null;
    public $nombre = '';
    public $estado = 0;
    public $proyectoId = '';

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->estado = $args['estado'] ?? 0; 
        $this->proyectoId = $args['proyectoId'] ?? '';
    }
}
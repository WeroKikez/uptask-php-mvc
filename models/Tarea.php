<?php 

namespace Model;

class Tarea extends ActiveRecord {
    protected static $tabla = 'tareas';
    protected static $columnasDB = ['id', 'nombre', 'estado', 'proyecto_id'];

    protected $id = null;
    protected $nombre = '';
    protected $estado = 0;
    protected $proyectoId = '';

    public function __construct($args = []) {
        $this->id = $args['id'];
        $this->nombre = $args['nombre'];
        $this->estado = $args['estado'];
        $this->proyectoId = $args['proyectoId'];
    }
}
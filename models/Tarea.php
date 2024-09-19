<?php 

namespace Model;

class Tarea extends ActiveRecord {
    protected static $tabla = 'tareas';
    protected static $columnasDB = ['id', 'nombre', 'estado', 'proyectoId'];

    protected $id = null;
    protected $nombre = '';
    protected $estado = 0;
    public $proyectoId = '';

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->estado = $args['estado'] ?? 0; 
        $this->proyectoId = $args['proyectoId'] ?? '';
    }
}
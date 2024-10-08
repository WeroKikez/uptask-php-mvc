(function() {

    obtenerTareas()
    let tareas = []
    let filtradas = []
    
    // Botón para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea')
    nuevaTareaBtn.addEventListener('click', () => {
        mostrarFormulario()
    })

    // Filtros de busqueda
    const filtros = document.querySelectorAll('#filtros input[type="radio"]')
    filtros.forEach( radio => {
        radio.addEventListener('input', filtrarTareas)
    })

    function filtrarTareas(e) {
        const filtro = e.target.value
        if(filtro !== '') {
            filtradas = tareas.filter( tarea => tarea.estado === filtro )
        } else {
            filtradas = []
        }

        mostrarTareas()
    }

    async function obtenerTareas() {
        try {
            const id = obtenerProyecto()
            const url = `/api/tareas?id=${id}`
            const respuesta = await fetch(url)
            const resultado = await respuesta.json()
            
            tareas = resultado.tareas
            mostrarTareas()
        } catch (error) {
            console.error("Ha Ocurrido Un Error: ")
            console.error(error)
        }
    }

    function mostrarTareas() {
        limpiarTareas()
        totalPendientes()
        totalCompletadas()

        const arrayTareas = filtradas.length ? filtradas : tareas

        if(arrayTareas.length === 0) {
            const contenedorTareas = document.querySelector('#listado-tareas')
            const textoNoTareas = document.createElement('LI')
            textoNoTareas.textContent = 'No hay tareas en este proyecto'
            textoNoTareas.classList.add('no-tareas')
            
            contenedorTareas.appendChild(textoNoTareas)
            return
        }

        const estados = {
            0: 'Pendiente',
            1: 'Completada'
        }
        arrayTareas.forEach( tarea => {
            const contenedorTarea = document.createElement('LI')
            contenedorTarea.dataset.tareaId = tarea.id
            contenedorTarea.classList.add('tarea')

            const nombreTarea = document.createElement('P')
            nombreTarea.textContent = tarea.nombre
            nombreTarea.ondblclick = () => {
                mostrarFormulario(true, {...tarea})
            }

            const opcionesDiv = document.createElement('DIV')
            opcionesDiv.classList.add('opciones')

            // Botones
            const btnEstadoTarea = document.createElement('BUTTON')
            btnEstadoTarea.classList.add('estado-tarea')
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`)
            btnEstadoTarea.textContent = estados[tarea.estado]
            btnEstadoTarea.dataset.estadoTarea = tarea.estado
            btnEstadoTarea.ondblclick = () => {
                cambiarEstadoTarea({...tarea})
            }

            const btnEliminarTarea = document.createElement('BUTTON')
            btnEliminarTarea.classList.add('eliminar-tarea')
            btnEliminarTarea.dataset.tareaId = tarea.id
            btnEliminarTarea.textContent = 'Eliminar'
            btnEliminarTarea.ondblclick = ()  => {
                confirmarEliminarTarea(tarea)
            }

            opcionesDiv.appendChild(btnEstadoTarea)
            opcionesDiv.appendChild(btnEliminarTarea)

            contenedorTarea.appendChild(nombreTarea)
            contenedorTarea.appendChild(opcionesDiv)

            const listadoTareas = document.querySelector('#listado-tareas')
            listadoTareas.appendChild(contenedorTarea)
        });
    }

    function totalPendientes() {
        const totalPendientes = tareas.filter( tarea => tarea.estado === "0" ).length
        const pendientesRadio = document.querySelector('#pendientes')
        pendientesRadio.disabled = totalPendientes <= 0 ? true : false
    }

    function totalCompletadas() {
        const totalCompletadas = tareas.filter( tarea => tarea.estado === "1").length
        const completadasRadio = document.querySelector('#completadas')
        completadasRadio.disabled = totalCompletadas <= 0 ? true : false
    }

    function mostrarFormulario( editar = false, tarea = {} ) {
        const modal = document.createElement('DIV')
        modal.classList.add('modal')
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar Tarea' : 'Añadir Nueva Tarea'}</legend>
                <div class="campo">
                    <label for="tarea">Tarea</label>
                    <input
                        name="tarea"
                        type="text"
                        placeholder="${editar ? 'Editar La Tarea' : 'Añadir Tarea Al Proyecto Actual'}"
                        id="tarea"
                        value="${tarea.nombre ? tarea.nombre : ''}"
                    />
                </div>

                <div class="opciones">
                    <input
                        type="submit"
                        class="submit-nueva-tarea"
                        value="${editar ? 'Guardar Cambios' : 'Añadir Tarea'}"
                    />
                    <button type="button" class="cerrar-modal">Cancelar</button> 
                </div>
            </form>
        `

        setTimeout(() => {
            const formulario = document.querySelector('.formulario')
            formulario.classList.add('animar')
        }, 10);

        modal.addEventListener('click', (e) => {
            e.preventDefault()

            if(e.target.classList.contains('cerrar-modal') || e.target.classList.contains('modal')) {
                const formulario = document.querySelector('.formulario')
                 formulario.classList.add('cerrar')
                
                setTimeout(() => {
                    modal.remove()
                }, 400);
            }

            if(e.target.classList.contains('submit-nueva-tarea')) {
                const nombreTarea = document.querySelector('#tarea').value.trim()

                if(nombreTarea === '') {
                    // Mostar alerta de error
                    mostrarAlerta('El nombre de la tarea es obligatorio', 'error', document.querySelector('.formulario legend'))
                    return
                }

                tarea.nombre = nombreTarea
                editar ? actualizarTarea(tarea) : agregarTarea(nombreTarea)
            }
        })

        document.querySelector('.dashboard').appendChild(modal)
    }

    // Muestra un mensaje en la interfaz
    function mostrarAlerta(mensaje, tipo, referencia) {
        // Previene la creación de múltiples alertas
        const alertaPrevia = document.querySelector('.alerta')
        if(alertaPrevia) {
            return
        }

        const alerta = document.createElement('DIV')
        alerta.classList.add('alerta', tipo)
        alerta.textContent = mensaje

        // Inserta la alerta antes de la referencia
        // referencia.parentElement.insertBefore(alerta, referencia)

        // Insertar después del a referencia
        referencia.parentElement.insertBefore(alerta, referencia.nextSibling)
        
        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            alerta.remove()
        }, 5000)
    }

    // Consultar el servidor para añadir una nueva tarea al proyecto actual
    async function agregarTarea(tarea) {
        // Construir la petición 
        const datos = new FormData()
        datos.append('nombre', tarea)
        datos.append('proyectoId', obtenerProyecto())

        try {
            const url = 'http://localhost:3200/api/tarea'
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            })

            const resultado = await respuesta.json();

            // Mostar alerta de error
            mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.formulario legend'))

            if(resultado.tipo === 'exito') {
                const modal = document.querySelector('.modal')
                bloquearBotonSubmit()   
                setTimeout(() => {
                    modal.remove()
                }, 1500);

                // Agregar el objeto de tarea al global de tareas
                const tareaObj = {
                    id: String(resultado.id),
                    nombre: tarea,
                    estado: 0,
                    proyectoId: resultado.proyectoId
                }

                tareas = [...tareas, tareaObj]
                mostrarTareas()

            }
        } catch (error) {
            console.error("Ha Ocurrido Un Error: ")
            console.error(error)
        }
    }

    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1"
        tarea.estado = nuevoEstado
        actualizarTarea(tarea)
    }

    async function actualizarTarea(tarea) {
        const { id, nombre, estado } = tarea
        const datos = new FormData()
        datos.append('id', id)
        datos.append('nombre', nombre)
        datos.append('estado', estado)
        datos.append('proyectoId', obtenerProyecto())
        
        try {
            const url = 'http://localhost:3200/api/tarea/actualizar'
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            })
            
            const resultado = await respuesta.json()
            if(resultado.respuesta.tipo === 'exito') {
                swal("Tarea Actualizada", resultado.respuesta.mensaje, "success");
                
                const modal = document.querySelector('.modal')
                if(modal){
                    setTimeout(() => {
                        modal.remove()
                    }, 1000);
                }
                
                tareas = tareas.map( tareaMemoria => tareaMemoria.id === resultado.respuesta.id ? {...tareaMemoria, estado: estado, nombre: nombre} : tareaMemoria )
                
                mostrarTareas()
            }
        } catch (error) {
            console.error("Ha Ocurrido Un Error: ")
            console.error(error)
        }
    }
    
    function confirmarEliminarTarea(tarea) {
        swal({
            title: "¿Seguro que deseas eliminar la tarea?",
            text: "Una vez eliminada, no podrás recuperarla",
            icon: "warning",
            buttons: true,
            buttons: ["Cancelar", "Eliminar"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                eliminarTarea(tarea)
            }
        });
    }

    async function eliminarTarea(tarea) {
        const { id, nombre, estado } = tarea
        const datos = new FormData()
        datos.append('id', id)
        datos.append('nombre', nombre)
        datos.append('estado', estado)
        datos.append('proyectoId', obtenerProyecto())
        
        try {
            const url = 'http://localhost:3200/api/tarea/eliminar'

            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            })

            const resultado = await respuesta.json()
            if(resultado.resultado) {
                // mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.contenedor-nueva-tarea'))
                swal(resultado.mensaje, {
                    icon: 'success',
                });
                tareas = tareas.filter( tarea => tarea.id !== id )
                mostrarTareas()
            }
        } catch (error) {
            console.error("Ha Ocurrido Un Error: ")
            console.error(error)
        }
    }

    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search)
        const proyectoId = proyectoParams.get('id')

        // const proyecto = Object.fromEntries(proyectoParams.entries())
        // console.log(proyecto.id)
        return proyectoId
    }

    function bloquearBotonSubmit() {
        const btnSubmit = document.querySelector('.submit-nueva-tarea')
        btnSubmit.classList.add('blocked')
        btnSubmit.disabled = true
        btnSubmit.value = 'Agregando...'
    }

    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas')
        
        while (listadoTareas.firstChild) {
            listadoTareas.removeChild(listadoTareas.firstChild)
        }
    }
})()
(function() {

    obtenerTareas()
    let tareas = []
    
    // Botón para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea')
    nuevaTareaBtn.addEventListener('click', mostrarFormulario)

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
        if(tareas.length === 0) {
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
        tareas.forEach( tarea => {
            const contenedorTarea = document.createElement('LI')
            contenedorTarea.dataset.tareaId = tarea.id
            contenedorTarea.classList.add('tarea')

            const nombreTarea = document.createElement('P')
            nombreTarea.textContent = tarea.nombre

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

            opcionesDiv.appendChild(btnEstadoTarea)
            opcionesDiv.appendChild(btnEliminarTarea)

            contenedorTarea.appendChild(nombreTarea)
            contenedorTarea.appendChild(opcionesDiv)

            const listadoTareas = document.querySelector('#listado-tareas')
            listadoTareas.appendChild(contenedorTarea)
        });
    }

    function mostrarFormulario() {
        const modal = document.createElement('DIV')
        modal.classList.add('modal')
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>Añade Una Nueva Tarea</legend>
                <div class="campo">
                    <label for="tarea">Tarea</label>
                    <input
                        name="tarea"
                        type="text"
                        placeholder="Añadir Tarea Al Proyecto Actual"
                        id="tarea"
                    />
                </div>

                <div class="opciones">
                    <input
                        type="submit"
                        class="submit-nueva-tarea"
                        value="Añadir Tarea"
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
                submitFormNuevaTarea()
            }
        })

        document.querySelector('.dashboard').appendChild(modal)
    }

    function submitFormNuevaTarea() {
        const tarea = document.querySelector('#tarea').value.trim()

        if(tarea === '') {
            // Mostar alerta de error
            mostrarAlerta('El nombre de la tarea es obligatorio', 'error', document.querySelector('.formulario legend'))
            return
        }

        agregarTarea(tarea)
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
                }, 3000);

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
        const { id, nombre, estado, proyectoId } = tarea
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
                mostrarAlerta(resultado.respuesta.mensaje, resultado.respuesta.tipo, document.querySelector('.contenedor-nueva-tarea'))
                
                tareas = tareas.map( tareaMemoria => tareaMemoria.id === resultado.respuesta.id ? {...tareaMemoria, estado: estado} : tareaMemoria )
                
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
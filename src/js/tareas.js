(function() {
    // Botón para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea')
    nuevaTareaBtn.addEventListener('click', mostrarFormulario)

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
                e.target.disabled = true;
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
                setTimeout(() => {
                    modal.remove()
                }, 3000);
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
})()
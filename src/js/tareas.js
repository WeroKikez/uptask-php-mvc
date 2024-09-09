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
        })

        document.querySelector('body').appendChild(modal)
    }
})()
(function() {
    // Botón para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea')
    nuevaTareaBtn.addEventListener('click', mostrarFormulario)

    function mostrarFormulario() {
        console.log('Mostrando form')
    }
})()
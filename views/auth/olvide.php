<div class="contenedor olvide">
    <?php include_once __DIR__ . '/../templates/nombre-sitio.php' ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Coloca tu email y reestablece tu password</p>

        <?php include_once __DIR__ . '/../templates/alertas.php' ?>

        <form
            class="formulario"
            method="POST" 
            action="/olvide"
        >
            <div class="campo">
                <label for="email">Email</label>

                <input 
                    type="email"
                    id="email"
                    placeholder="Tu Email"
                    name="email" >
            </div>

            <input 
                class="boton" 
                type="submit"
                value="Enviar Instrucciones">
        </form>

        <div class="acciones">
            <a href="/">¿Ya tienes cuenta? Inicia Sesión</a>
            <a href="/crear">¿Aún no tienes cuenta? Obten una</a>
        </div>
    </div> <!-- contenedor-sm -->
</div>
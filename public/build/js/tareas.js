!function(){!async function(){try{const a=`/api/tareas?id=${o()}`,n=await fetch(a),r=await n.json();e=r.tareas,t()}catch(e){console.error("Ha Ocurrido Un Error: "),console.error(e)}}();let e=[];function t(){if(function(){const e=document.querySelector("#listado-tareas");for(;e.firstChild;)e.removeChild(e.firstChild)}(),0===e.length){const e=document.querySelector("#listado-tareas"),t=document.createElement("LI");return t.textContent="No hay tareas en este proyecto",t.classList.add("no-tareas"),void e.appendChild(t)}const n={0:"Pendiente",1:"Completada"};e.forEach((r=>{const c=document.createElement("LI");c.dataset.tareaId=r.id,c.classList.add("tarea");const s=document.createElement("P");s.textContent=r.nombre;const d=document.createElement("DIV");d.classList.add("opciones");const i=document.createElement("BUTTON");i.classList.add("estado-tarea"),i.classList.add(`${n[r.estado].toLowerCase()}`),i.textContent=n[r.estado],i.dataset.estadoTarea=r.estado,i.ondblclick=()=>{!function(n){const r="1"===n.estado?"0":"1";n.estado=r,async function(n){const{id:r,nombre:c,estado:s,proyectoId:d}=n,i=new FormData;i.append("id",r),i.append("nombre",c),i.append("estado",s),i.append("proyectoId",o());try{const o="http://localhost:3200/api/tarea/actualizar",n=await fetch(o,{method:"POST",body:i}),r=await n.json();"exito"===r.respuesta.tipo&&(a(r.respuesta.mensaje,r.respuesta.tipo,document.querySelector(".contenedor-nueva-tarea")),e=e.map((e=>e.id===r.respuesta.id?{...e,estado:s}:e)),t())}catch(e){console.error("Ha Ocurrido Un Error: "),console.error(e)}}(n)}({...r})};const l=document.createElement("BUTTON");l.classList.add("eliminar-tarea"),l.dataset.tareaId=r.id,l.textContent="Eliminar",l.ondblclick=()=>{!function(a){swal({title:"¿Seguro que deseas eliminar la tarea?",text:"Una vez eliminada, no podrás recuperarla",icon:"warning",buttons:!0,buttons:["Cancelar","Eliminar"],dangerMode:!0}).then((n=>{n&&async function(a){const{id:n,nombre:r,estado:c}=a,s=new FormData;s.append("id",n),s.append("nombre",r),s.append("estado",c),s.append("proyectoId",o());try{const a="http://localhost:3200/api/tarea/eliminar",o=await fetch(a,{method:"POST",body:s}),r=await o.json();r.resultado&&(swal(r.mensaje,{icon:"success"}),e=e.filter((e=>e.id!==n)),t())}catch(e){console.error("Ha Ocurrido Un Error: "),console.error(e)}}(a)}))}(r)},d.appendChild(i),d.appendChild(l),c.appendChild(s),c.appendChild(d);document.querySelector("#listado-tareas").appendChild(c)}))}function a(e,t,a){if(document.querySelector(".alerta"))return;const o=document.createElement("DIV");o.classList.add("alerta",t),o.textContent=e,a.parentElement.insertBefore(o,a.nextSibling),setTimeout((()=>{o.remove()}),5e3)}function o(){return new URLSearchParams(window.location.search).get("id")}document.querySelector("#agregar-tarea").addEventListener("click",(function(){const n=document.createElement("DIV");n.classList.add("modal"),n.innerHTML='\n            <form class="formulario nueva-tarea">\n                <legend>Añade Una Nueva Tarea</legend>\n                <div class="campo">\n                    <label for="tarea">Tarea</label>\n                    <input\n                        name="tarea"\n                        type="text"\n                        placeholder="Añadir Tarea Al Proyecto Actual"\n                        id="tarea"\n                    />\n                </div>\n\n                <div class="opciones">\n                    <input\n                        type="submit"\n                        class="submit-nueva-tarea"\n                        value="Añadir Tarea"\n                    />\n                    <button type="button" class="cerrar-modal">Cancelar</button> \n                </div>\n            </form>\n        ',setTimeout((()=>{document.querySelector(".formulario").classList.add("animar")}),10),n.addEventListener("click",(r=>{if(r.preventDefault(),r.target.classList.contains("cerrar-modal")||r.target.classList.contains("modal")){document.querySelector(".formulario").classList.add("cerrar"),setTimeout((()=>{n.remove()}),400)}r.target.classList.contains("submit-nueva-tarea")&&function(){const n=document.querySelector("#tarea").value.trim();if(""===n)return void a("El nombre de la tarea es obligatorio","error",document.querySelector(".formulario legend"));!async function(n){const r=new FormData;r.append("nombre",n),r.append("proyectoId",o());try{const o="http://localhost:3200/api/tarea",c=await fetch(o,{method:"POST",body:r}),s=await c.json();if(a(s.mensaje,s.tipo,document.querySelector(".formulario legend")),"exito"===s.tipo){const a=document.querySelector(".modal");!function(){const e=document.querySelector(".submit-nueva-tarea");e.classList.add("blocked"),e.disabled=!0,e.value="Agregando..."}(),setTimeout((()=>{a.remove()}),1500);const o={id:String(s.id),nombre:n,estado:0,proyectoId:s.proyectoId};e=[...e,o],t()}}catch(e){console.error("Ha Ocurrido Un Error: "),console.error(e)}}(n)}()})),document.querySelector(".dashboard").appendChild(n)}))}();
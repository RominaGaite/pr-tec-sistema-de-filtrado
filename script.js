// Almacenar los datos cargados
let datos = [];

// PRIMER PARTE : OBTENGO LOS DATOS GENERADOS EN EL JSON//

// Función para traer los datos de  data.json
async function cargarDatos() {
    console.log('Realizando la solicitud al archivo JSON...');
    try {
        const response = await fetch('./data.json');
        datos = await response.json(); 

        // para convertir las fechas de cadena a objetos Date
        datos.forEach(recurso => {
            const partesFecha = recurso["Fecha de la orden de trabajo"].split('-');
            recurso.fechaOrdenTrabajo = new Date(partesFecha[2], partesFecha[0] - 1, partesFecha[1]);

            recurso.Monto = parseFloat(recurso.Monto);
        });

        console.log('Datos cargados:', datos);

        // para que los meses aparezcan de forma dinamica
        const selectMes = document.getElementById('selectMes');
        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.text = `${i + 1}`;
            option.value = `${i + 1}`;
            selectMes.add(option);
        }

        // para que los años aparezcan de forma dinamica
        const selectAnio = document.getElementById('selectAnio');
        const currentYear = new Date().getFullYear();
        for (let i = 2020; i <= currentYear; i++) {
            const option = document.createElement('option');
            option.text = `${i}`;
            option.value = `${i}`;
            selectAnio.add(option);
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

window.onload = cargarDatos;

// CONFIGURACION DEL MODAL PARA QUE SURGA CUANDOUN DATO NO APAREZCA DE ACUERDO A LA CONDICION DE FILTRADO //
 
  function mostrarModal(mensaje) {
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="close" onclick="cerrarModal()">&times;</span>
        <div class="modal-body">
            <div class="text-container">
                <p>${mensaje}</p>
            </div>
            <div class="gif-container">
                <div class="gif-modal">
                    <img src="https://media.tenor.com/wrBNCIKgMBwAAAAi/person-man.gif"></img>
                </div>
            </div>
        </div>`;

    modal.style.display = 'block';
}

function cerrarModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}
 //FILTRADO//



// Función para filtrar y mostrar la información del recurso
function filtrarRecursos() {
    const inputNombre = document.getElementById('inputNombre').value.trim();
    const selectMes = document.getElementById('selectMes').value;
    const selectAnio = document.getElementById('selectAnio').value;
    const inputNumeroTarea = document.getElementById('inputNumeroTarea').value.trim();
    const inputNumeroProyecto = document.getElementById('inputNumeroProyecto').value.trim();
    const inputNumeroOrden = document.getElementById('inputNumeroOrden').value.trim();

   
    if (datos.length === 0) {
        console.log('Los datos aún no se han cargado completamente.');
        return;
    }

    const recursosFiltradosPorNombre = datos.filter(recurso => {
        const nombreMatch = recurso["Nombre completo de recurso"].toLowerCase().includes(inputNombre.toLowerCase());
        return nombreMatch;
    });

   
    const totalMontosPorNombre = recursosFiltradosPorNombre.reduce((total, recurso) => total + recurso.Monto, 0);
    const promedioPorNombre = recursosFiltradosPorNombre.length ? totalMontosPorNombre / recursosFiltradosPorNombre.length : 0;
    console.log(`El promedio para los recursos filtrados por nombre es: ${promedioPorNombre}`);

    // Filtrar nuevamente los recursos que superan el promedio calculado
    const recursosASuperarPromedioPorNombre = recursosFiltradosPorNombre.filter(recurso => recurso.Monto > promedioPorNombre);


    // Filtrar los recursos según los criterios solicitados
    const recursosFiltrados = recursosASuperarPromedioPorNombre.filter(recurso => {
        const fechaOrdenTrabajo = new Date(recurso["Fecha de la orden de trabajo"]);
        const mesMatch = !selectMes || fechaOrdenTrabajo.getMonth() + 1 === parseInt(selectMes);
        const anioMatch = !selectAnio || fechaOrdenTrabajo.getFullYear() === parseInt(selectAnio);
        const numeroTareaMatch = !inputNumeroTarea || recurso["Nro de tarea"].includes(inputNumeroTarea);
        const numeroProyectoMatch = !inputNumeroProyecto || recurso["Nro de proyecto"].includes(inputNumeroProyecto);
        const numeroOrdenMatch = !inputNumeroOrden || recurso["Nro de orden de trabajo"].includes(inputNumeroOrden);

        return mesMatch && anioMatch && numeroTareaMatch && numeroProyectoMatch && numeroOrdenMatch;
    });


    const listaRecursos = document.getElementById('listaRecursos');
    listaRecursos.innerHTML = ''; 

   
    if (!recursosFiltrados.length) {
        const mensaje = "No hay informacion para el filtro solicitado.";
        mostrarModal(mensaje);
        return; 
    }

    // Mostrar los recursos filtrados en la lista
    recursosFiltrados.forEach(recurso => {
        const fila = document.createElement('tr');
        for (const key in recurso) {
            if (recurso.hasOwnProperty(key) && key !== 'fechaOrdenTrabajo') { 
                const celda = document.createElement('td');
                if (key === 'Monto') {
                    celda.textContent = '$' + recurso[key]; 
                } else {
                    celda.textContent = recurso[key];
                }
                fila.appendChild(celda);
            }
        }
        listaRecursos.appendChild(fila); 
    });
}
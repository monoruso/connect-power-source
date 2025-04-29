const polaridades = ["Positiva al centro", "Negativa al centro"];

function generarValor(min, max, paso = 100) {
    return Math.floor(Math.random() * ((max - min) / paso + 1)) * paso + min;
}

function generarFuente() {
    return {
        voltaje: generarValor(5, 24, 1),
        corriente: generarValor(100, 2000, 100),
        polaridad: polaridades[Math.floor(Math.random() * polaridades.length)]
    };
}

function verificarCompatibilidad(fuente, equipo) {
    const errores = [];

    if (fuente.voltaje < equipo.voltaje) {
        errores.push("Voltaje insuficiente");
    } else if (fuente.voltaje > equipo.voltaje) {
        errores.push("Voltaje excesivo");
    }

    if (fuente.corriente < equipo.corriente) {
        errores.push("Corriente insuficiente");
    }

    if (fuente.polaridad !== equipo.polaridad) {
        errores.push("Polaridad incorrecta");
    }

    return {
        esCompatible: errores.length === 0,
        errores: errores
    };
}

function mostrarEquipo(equipo) {
    const imagenPolaridad = equipo.polaridad === "Positiva al centro"
        ? "images/positivo_al_centro.png"
        : "images/negativo_al_centro.png";

    // Decidir aleatoriamente si mostrar la corriente en mA o A
    const corrienteConUnidad = obtenerUnidadCorriente(equipo.corriente, equipo.corriente);

    document.getElementById("equipo-info").innerHTML = `
        <strong>Voltaje:</strong> ${equipo.voltaje}V<br>
        <strong>Corriente:</strong> ${corrienteConUnidad}<br>
        <strong>Polaridad:</strong><br>
        <img src="${imagenPolaridad}" alt="Polaridad" style="width: 100px; height: auto; margin-top: 5px;">
    `;
}

// Función para obtener la unidad correspondiente a la corriente (mA o A)
function obtenerUnidadCorriente(valor, corriente) {
    // Si la corriente es mayor o igual a 1000, selecciona aleatoriamente entre mA y A
    if (corriente >= 1000) {
        const mostrarEnAmpere = Math.random() < 0.5; // 50% de probabilidad
        // Si es en amperios, convertir mA a A
        return mostrarEnAmpere ? `${(valor / 1000).toFixed(1)} A` : `${valor} mA`;
    } else {
        return `${valor} mA`; // Si es menor a 1000, siempre en miliamperios
    }
}




function mostrarResultado(mensaje, tipo) {
    const resultadoEmergente = document.getElementById("resultado-emergente");
    const mensajeResultado = document.getElementById("mensaje-resultado");

    // Asignar el mensaje y clase dependiendo de si es correcto o incorrecto
    mensajeResultado.textContent = mensaje;

    // Cambiar el color del mensaje (puedes personalizar esto según sea necesario)
    if (tipo === "correcto") {
        resultadoEmergente.style.backgroundColor = "#4CAF50"; // Verde para correcto
    } else {
        resultadoEmergente.style.backgroundColor = "#F44336"; // Rojo para incorrecto
    }

    // Mostrar la ventana emergente
    resultadoEmergente.style.display = "block";
}

function cerrarResultado() {
    // Ocultar la ventana emergente
    document.getElementById("resultado-emergente").style.display = "none";
    // Puedes reactivar el ejercicio si es necesario
}

function siguienteEjercicio() {
    // Cerrar la ventana emergente
    cerrarResultado();

    // Limpiar contenido previo (por ejemplo, fuentes y equipo)
    document.getElementById("fuente-lista").innerHTML = "";
    document.getElementById("equipo-info").innerHTML = "";

    // Generar un nuevo ejercicio
    iniciarEjercicio();

    // Mostrar el nuevo ejercicio
}

function generarNuevoEjercicio() {
    // Limpiar el contenido anterior
    document.getElementById("fuente-lista").innerHTML = "";
    document.getElementById("equipo-info").innerHTML = "";

    // Aquí agregas la lógica para crear un nuevo ejercicio
    equipo = obtenerEquipoAleatorio();
    fuentes = obtenerFuentesAleatorias();

    // Actualizar la interfaz con el nuevo ejercicio
    mostrarFuentes(fuentes, equipo);
    mostrarEquipo(equipo);
}

// En el botón de siguiente ejercicio
document.getElementById("siguiente-btn").onclick = siguienteEjercicio;

function cargarSiguienteEjercicio() {
    // Este es un lugar donde puedes agregar la lógica para cargar el siguiente ejercicio
    console.log("Ejercicio cargado.");
    // Aquí deberías cargar nuevas fuentes, equipo, etc., o cambiar de ejercicio.
    // Llama a la función que maneja la carga de ejercicios.
    mostrarFuentes(fuentes, equipo); // Esto sería solo un ejemplo
}




function mostrarFuentes(fuentes, equipo) {
    const contenedor = document.getElementById("fuente-lista");
    contenedor.innerHTML = "";

    fuentes.forEach((fuente, i) => {
        const div = document.createElement("div");
        div.className = "fuente";
        const imagenPolaridad = fuente.polaridad === "Positiva al centro"
            ? "images/positivo_al_centro.png"
            : "images/negativo_al_centro.png";

        div.innerHTML = ` 
            <strong>Fuente ${i + 1}</strong><br>
            Voltaje: ${fuente.voltaje}V<br>
            Corriente: ${fuente.corriente} mA<br>
            Polaridad:<br>
            <img src="${imagenPolaridad}" alt="Polaridad" style="width: 80px; height: auto; margin: 5px 0;"><br>
        `;

        div.onclick = () => {
            const resultado = verificarCompatibilidad(fuente, equipo);
            if (resultado.esCompatible) {
                mostrarResultado("¡Correcto!", "correcto");
            } else {
                mostrarResultado("Fuente incorrecta: " + resultado.errores.join(", "), "incorrecto");
            }
        };


        contenedor.appendChild(div);
    });
}


const CANTIDAD_DE_FUENTES = 4;

function iniciarEjercicio() {
    const equipo = generarFuente();
    let fuentes = Array(CANTIDAD_DE_FUENTES);

    // Asegurar que al menos una fuente sea compatible
    const correctaIndex = Math.floor(Math.random() * CANTIDAD_DE_FUENTES);

    fuentes[correctaIndex] = {
        voltaje: equipo.voltaje,
        polaridad: equipo.polaridad,
        corriente: generarValor(equipo.corriente, 2000, 100)
    };

    for (let i = 0; i < CANTIDAD_DE_FUENTES; i++) {
        if (i === correctaIndex) continue;

        const tipoDeTrampa = Math.floor(Math.random() * 3); // 0: voltaje malo, 1: corriente mala, 2: polaridad mala

        let fuenteTrampa = {
            voltaje: equipo.voltaje,
            corriente: generarValor(equipo.corriente, 2000, 100),
            polaridad: equipo.polaridad
        };

        if (tipoDeTrampa === 0) {
            // Cambiar voltaje
            let nuevoVoltaje;
            do {
                nuevoVoltaje = generarValor(5, 24, 1);
            } while (nuevoVoltaje === equipo.voltaje);
            fuenteTrampa.voltaje = nuevoVoltaje;
        } else if (tipoDeTrampa === 1) {
            // Corriente insuficiente
            if (equipo.corriente > 100) {
                fuenteTrampa.corriente = generarValor(100, equipo.corriente - 100, 100);
            } else {
                // Si no es posible generar menos, forzamos 50 mA como incorrecta
                fuenteTrampa.corriente = 50;
            }
        } else {
            // Polaridad invertida
            fuenteTrampa.polaridad = equipo.polaridad === "Positiva al centro" ? "Negativa al centro" : "Positiva al centro";
        }

        fuentes[i] = fuenteTrampa;
    }


    mostrarEquipo(equipo);
    mostrarFuentes(fuentes, equipo);
    document.getElementById("mensaje").textContent = "";
    document.getElementById("mensaje").className = "";
}

document.getElementById("siguiente-btn").onclick = iniciarEjercicio;

window.onload = iniciarEjercicio;


// Mostrar vista de ayuda y ocultar ejercicio
document.getElementById("ayuda-btn").onclick = () => {
    document.getElementById("vista-ayuda").style.display = "flex"; // Mostrar ayuda
    document.getElementById("ejercicio").style.display = "none"; // Ocultar ejercicio
};

// Volver al ejercicio y ocultar la ayuda
document.getElementById("volver-btn").onclick = () => {
    document.getElementById("vista-ayuda").style.display = "none"; // Ocultar ayuda
    document.getElementById("ejercicio").style.display = "block"; // Mostrar ejercicio
};

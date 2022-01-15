// Selectores globales para la aplicacion
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const enviarBtn = document.querySelector('.enviar');

// Cuando la venana global se termina de cargar, escucha el evento submit del formulario
window.addEventListener('load', ()=>{
  formulario.addEventListener('submit', buscarClima);
});

// Validad el formulario y busca el clima de acuerdo a los parametros ingresados por el usuario
function buscarClima(e) {
  e.preventDefault();
  // Validar
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  if (ciudad === '' || pais ==='') {
    // Hubo un error
    mostrarAlerta('Ambos campos son obligatorios', 'error');
  }
  // Consular API
  consultarAPI(ciudad, pais)

}

// Envia la ciudad y el pais a la API para poder ser procesada y mostrada en el front de la app
function consultarAPI(ciudad, pais) {
  const appId = '374cff81c8e08b2c83935fcdbcde0b43';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
  
  // Mostrar un spinner
  mostrarSpinner();

  fetch(url)
    .then(result => result.json())

    .then(clima =>{
      // Limpia el HTML previo
      limpiarHTML();
      // Comprueba si la ciudad ingresada existe
      if (clima.cod === "404") {
        mostrarAlerta('Ciudad no encontrada, verifique que la ciudad sea la correcta.' , 'error');
        enviarBtn.textContent = `Obtener Clima`;
        formulario.reset();
        return;
      }
      console.log(clima.weather[0].icon);
      // Muestra el clima en el HTML
      mostrarClima(clima);
      enviarBtn.textContent = `Obtener Clima`;
      formulario.reset();
    })

    .catch((err) => {
      mostrarAlerta('Hubo un problema al realizar la consulta, verifique los datos ingresados', 'error');
      enviarBtn.textContent = `Obtener Clima`;
      formulario.reset();
    });
}

// Mustra un spinner
function mostrarSpinner(){
  enviarBtn.innerHTML = `
  <i class='bx bx-radio-circle bx-burst bx-rotate-90' ></i> Procesando...
  `;
}
// Muestra el clima en el HTML
function mostrarClima(clima){

  const { name, main: { temp, temp_max, temp_min } } = clima;
  const temperatura = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `${name}`;
  nombreCiudad.classList.add('font-bold', 'text-2xl');

  const actual = document.createElement('p');
  actual.innerHTML = `${temperatura} &#8451;`;
  actual.classList.add('font-bold', 'text-6xl','text-center', 'flex', 'justify-center', 'items-center');
  
  const icon = document.createElement('img');
  icon.src = `http://openweathermap.org/img/w/${clima.weather[0].icon}.png`;

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `Max: ${max} &#8451;`;
  tempMaxima.classList.add('text-xl');

  const tempMinima = document.createElement('p');
  tempMinima.innerHTML = `Min: ${min} &#8451;`;
  tempMinima.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  actual.appendChild(icon);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);

}

// De Kelvin a centigrados
const kelvinACentigrados = grados =>  parseInt( grados - 273.15 );
 
// Limpia el HTML previo
function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.firstChild.remove();
  }
}

// funcion reutilizable para mostrar alertas al usuario dentro de la app
function mostrarAlerta(mensaje, tipo) {

  // selectores
  const divAlerta = document.createElement('div');
  divAlerta.classList.add('alerta');
  // En caso de que no haya una alerta ...
  if (!document.querySelector('.alerta')) {
    // Comprueba el tipo de alerta
    if (tipo === 'error') {
      // Codigo HTML
      divAlerta.innerHTML = `
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div class="fixed top-0 z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!--
            Background overlay, show/hide based on modal state.
      
            Entering: "ease-out duration-300"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100"
              To: "opacity-0"
          -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
          <!--
            Modal panel, show/hide based on modal state.
      
            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          -->
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <!-- Heroicon name: outline/exclamation -->
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Ups! Hubo un error
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      ${mensaje}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
      

      const parrafo = document.createElement('p');
      parrafo.textContent = 'Agrega tu ciudad y país, el resultado se mostrará aquí';
      parrafo.classList.add('text-center', 'text-white', 'mt-6' ,'w-100');
      resultado.appendChild(parrafo);   
      
      container.appendChild(divAlerta);
      setTimeout(() => {
        divAlerta.remove();
      }, 2000);
      return;
    }
  }
}
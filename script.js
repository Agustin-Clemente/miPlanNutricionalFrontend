//document.addEventListener('DOMContentLoaded', function() {
     const btnRegistrar = document.getElementById('btn-registrar');
   const fechaComidaInput = document.getElementById('fecha-comida');
    const horaComidaInput = document.getElementById('hora-comida');
    const comidaInput = document.getElementById('comida');/*
    const comidasRegistradasDiv = document.getElementById('comidas-registradas');

   
    

    let comidasRegistradas = JSON.parse(localStorage.getItem('comidasRegistradas')) || [];
    renderComidas(); */

    btnRegistrar.addEventListener('click', async function() {
        const fechaComida = document.getElementById("fecha-comida").value;
    const horaComida = document.getElementById("hora-comida").value;
    const comida = document.getElementById("comida").value;
    const evento = document.getElementById("evento").checked;

    const nuevaComida = {
        fecha: fechaComida,
        hora: horaComida,
        comida: comida,
        evento: evento
    };

    try {
        const respuesta = await fetch('https://miplannutricionalbackend.onrender.com/api/comidas', {
          // const respuesta = await fetch('http://localhost:10000/api/comidas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaComida),
          });
          
        if (respuesta.ok) {
            console.log('Comida registrada correctamente');
            // Actualizar la lista de comidas
            fetchComidas();
            
            document.getElementById("fecha-comida").value = "";
            document.getElementById("hora-comida").value = "";
            document.getElementById("comida").value = "";
            document.getElementById("evento").checked = false;

            Swal.fire({
              icon: 'success',
              title: '¡Comida agregada!',
              text: 'La comida ha sido agregada correctamente.',
              showConfirmButton: true
          });
        } else {
            console.error('Error al registrar la comida');
            const data = await respuesta.json();
            console.log(data.message);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Hubo un problema al agregar la comida. ${data.message}`,
              showConfirmButton: true
          });
        }
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    
});

const fetchComidas = async () => {
    try {
      const response = await fetch('https://miplannutricionalbackend.onrender.com/api/comidas');
      // const response = await fetch('http://localhost:10000/api/comidas');
      if (!response.ok) {
        throw new Error(`Error al obtener las comidas: ${response.statusText}`);
      }
      const comidas = await response.json();
      actualizarListaComidas(comidas);
    } catch (error) {
      console.error('Error:', error);
    }finally {
      // Ocultar el spinner
      document.getElementsByClassName('loader')[0].style.display = 'none';
      document.getElementsByClassName('carga')[0].style.display = 'none';
    }
  };

  const groupByDate = (data) => {
    return data.reduce((result, currentItem) => {
        const dateKey = new Date(currentItem.fecha).toISOString().split('T')[0]; // Extract the date part (YYYY-MM-DD)
        if (!result[dateKey]) {
            result[dateKey] = [];
        }
        result[dateKey].push(currentItem);
        return result;
    }, {});
};

const createCard = (date, items) => {
  const card = document.createElement('div');
  card.className = 'card';
  
  const hasEvent = items.some(item => item.evento);
  if (hasEvent) {
      const eventLabel = document.createElement('div');
      eventLabel.className = 'event-label';
      eventLabel.textContent = 'Evento';
      card.appendChild(eventLabel);
  }
  
  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';
  const headerTitle = document.createElement('h2');
  headerTitle.textContent = formatearFechaConGuiones(date);
  cardHeader.appendChild(headerTitle);
  card.appendChild(cardHeader);
  
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  const list = document.createElement('ul');
  
  items.forEach(item => {
      const listItem = document.createElement('li');
      const timeSpan = document.createElement('span');
      const comidaSpan = document.createElement('span');
      comidaSpan.className = 'centrar';
      timeSpan.textContent = item.hora;
      comidaSpan.textContent = item.comida;
      listItem.appendChild(timeSpan);
      listItem.append(comidaSpan);
      list.appendChild(listItem);
  });
  
  cardBody.appendChild(list);
  card.appendChild(cardBody);
  
  return card;
};




  const actualizarListaComidas = (comidas) => {

    const groupedData = groupByDate(comidas);
console.log(groupedData);
    
    const listaComidasElement = document.getElementById('lista-comidas');
    listaComidasElement.innerHTML = ""; // Limpiar la lista anterior

    /* comidas.forEach(comida => {
        const listItem = document.createElement('li');
        listItem.textContent = `${formatearFechaConGuiones(comida.fecha)} - ${comida.hora} - ${comida.comida}  ${comida.evento ? 'Evento' : ''}`;
        listaComidasElement.appendChild(listItem);
      }); */

      Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        
    const card = createCard(date, groupedData[date]);
    listaComidasElement.appendChild(card);
});
};

fetchComidas();

function formatearFechaConGuiones(fechaString) {
    // 1. Extraer el día, mes y año de la cadena
    const anio = fechaString.substring(0, 4);      // '2025'
    const mes = fechaString.substring(5, 7);        // '02'
    const dia = fechaString.substring(8, 10);      // '01'
  
    // 2. Unir las partes con guiones
    return `${dia}-${mes}-${anio}`;                // '01-02-2025'
  }

  //  });

    /* function renderComidas() {
        comidasRegistradasDiv.innerHTML = '';

        if (comidasRegistradas.length > 0) {
            const ul = document.createElement('ul');

            comidasRegistradas.forEach(comida => {
                const li = document.createElement('li');
                li.textContent = `${comida.fecha} ${comida.hora}: ${comida.comida}`;
                ul.appendChild(li);
            });

            comidasRegistradasDiv.appendChild(ul);
        } else {
            comidasRegistradasDiv.textContent = 'Aún no has registrado ninguna comida.';
        }
    } */


        const validateInputs = () => {
          if (fechaComidaInput.value && horaComidaInput.value && comidaInput.value) {
              btnRegistrar.disabled = false;
          } else {
            btnRegistrar.disabled = true;
          }
      };

      fechaComidaInput.addEventListener('input', validateInputs);
      horaComidaInput.addEventListener('input', validateInputs);
      comidaInput.addEventListener('input', validateInputs);
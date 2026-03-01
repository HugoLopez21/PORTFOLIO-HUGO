
let baraja = []; //Se alamcenan las cartas desordenadas
let estadoPartida = false;

//Elementos del dom
const objetivo = 7.5;
const botonJugar = document.getElementById('btn-comenzar');
const botonPedirCarta = document.getElementById('btn-solicitar');
const botonPlantarse = document.getElementById('btn-plantarse');
const textoPuntosPersona = document.getElementById('puntosPersona');
const textoPuntosMaquina = document.getElementById('puntosMaquina');
const mensajePartida = document.getElementById('info-partida');
const puntTotPersona = document.getElementById('puntTotPersona');
const puntTotMaquina = document.getElementById('puntTotMaquina');


let n_carta = 0;
let partidaTerminada = false;


// Clase de jugador
class jugador {
    constructor(cartas = [], puntos = 0){
        this.nombre = 'Jugador'
        this.cartas = cartas;
        this.puntosRonda = puntos;
        this.puntosTotales = 0;
        this.estaPlantado = false;
        this.turno = false;
        this.gana = false;
    };


    mostrarCarta(carta){
        const canvas = document.getElementById(`canva-${this.nombre}`);
        const context = canvas.getContext('2d');
        const img = new Image();

        img.src = carta.imagen;
        img.alt = `${carta.valor} de ${carta.palo}`;

        img.addEventListener('load', () => {
            
            
            const espacioTotal = this.cartas.length * 80;
            const inicioX = (canvas.width - espacioTotal) / 2;
            
            this.cartas.forEach((c, index) => {
                const cartaImg = new Image();
                cartaImg.src = c.imagen;
                cartaImg.onload = () => {
                    context.drawImage(cartaImg, inicioX + (index * 80), 25);
                };
            });
        });

        img.addEventListener('error', () => {
            console.error('No s\'ha pogut carregar la imatge');
        });
    };

    perderRonda(){
        this.turno = false; //Se acaba su turno
        this.estaPlantado = false;
        estadoPartida = false;
        maquina.gana = true; 
        
        //Si la persona pierde y sus puntos no son 0 se le resta 1
        if (this.nombre === 'Jugador'){
            if(this.puntosTotales != 0){
            this.puntosTotales -=1;
            };
        };
        if (this.puntosRonda > objetivo){
            mensajePartida.textContent = 'Te has pasado de puntos HAS PERDIDO';
        }else{
            mensajePartida.textContent = `HAS PERDIDO con una puntuación de ${this.puntosRonda}`;
        };
        
        maquina.puntosTotales +=1
        actualizaPuntosRonda();

    };
    
    ganarRonda(){
        this.gana = true;
        this.puntosTotales +=1;
        mensajePartida.textContent = `${this.nombre} gana con una puntuación de ${this.puntosRonda}`
    }

    //Funcion para solicitar carta
    pideCarta(carta){
        this.cartas.push(carta); //Mete la carta en la baraja del jugador
        this.puntosRonda += carta.puntuaje; //Suma lo que vale la carta
        this.mostrarCarta(carta); //La dibuja en el canva
        n_carta += 1; //Avanza en el indice de la baraja

        
        if (this.nombre === 'Máquina') {
            textoPuntosMaquina.textContent = `${this.puntosRonda}`;
        } else {
            textoPuntosPersona.textContent = `${this.puntosRonda}`;
        };

        //Si se pasa de 7.5perde
        if (this.puntosRonda > objetivo){
            this.perderRonda();
        };
    };


    plantarse(){
        this.turno = false;
        this.estaPlantado = true;
    };



};

class JugadorMaquina extends jugador {
    constructor(cartas = [], puntos = 0){
        super(cartas, puntos);
        this.nombre = 'Máquina';
        this.puntosTotales = 0
        this.turno = false;
    }
    perderRonda(){
        this.turno = false;
        estadoPartida = false;
        persona.gana = true;
        persona.puntosTotales +=1
        if (this.puntosRonda > objetivo){
            mensajePartida.textContent = 'LA MAQUINA SE HA pasado de puntos GANAS LA RONDA ';
        }else{
            mensajePartida.textContent = `LA MAQUINA HA PERDIDO LA RONDA con una puntuación de ${this.puntosRonda}`;
        };
        persona.puntosRonda +=1;
        actualizaPuntosRonda();
    };

    pideCarta(carta){
        super.pideCarta(carta);  
    };


    plantarse(){
        super.plantarse();
    };

    ganarRonda(){
        super.ganarRonda();
    };
    
    maquinaJugar(){
        /*Si la maquina tiene 5.5 o menos pide carta, si tiene 6 o 
        7.5 se planta
        Liego se comprueba el ganador*/ 
        this.turno = true;
        while(this.puntosRonda <= 5.5){
            this.pideCarta(baraja[n_carta]);  
        };
    
        if (this.puntosRonda >= 6 && this.puntosRonda <= objetivo){
            this.plantarse();
            comprobarGanador([persona,maquina]);
        };
    };
};


function comprobarGanador(listaJugadores){
 //Si ambos están plantados le da el valor de ganador al que tiene mas puntos
    if(listaJugadores[0].estaPlantado && listaJugadores[1].estaPlantado){
        if (listaJugadores[0].puntosRonda === listaJugadores[1].puntosRonda){
            mensajePartida.textContent = 'EMPATE'
        }else{
            const mayor = listaJugadores.reduce((max, j) => j.puntosRonda > max.puntosRonda ? j : max);
            mayor.ganarRonda();
        };
    };
    actualizaPuntosRonda();
};

function actualizaPuntosRonda(){
    puntTotPersona.textContent = `PUNTUACIÓN TOTAL: ${persona.puntosTotales}`
    puntTotMaquina.textContent = `PUNTUACIÓN TOTAL: ${maquina.puntosTotales}`
}

// Convierte en objeto de js el archivo json con la info de las cartas
function generaBaraja(){
    fetch("cartas.json")
    .then(response => response.json())
    .then(dataJson => {
        baraja = dataJson;
    });
};

// Ordena aletoriamente la baraja
function barajaCartas(baraja){
  	for (let i = baraja.length - 1; i > 0; i--) {
    	const j = Math.floor(Math.random() * (i + 1));
    	[baraja[i], baraja[j]] = [baraja[j], baraja[i]]
  	}
  	return baraja;
}




// Espera a que se carguen los datos del json
async function cargarBaraja() {
    const response = await fetch("cartas.json");
    baraja = await response.json();
    barajaCartas(baraja);
}


botonJugar.addEventListener("click", ()=>{
    botonJugar.textContent = 'RENICIAR PARTIDA'
    restableceContenido();
    if(estadoPartida){
        mensajePartida.textContent = 'PARTIDA REINCIADA';

    }else{
        mensajePartida.textContent = 'PARTIDA COMENZADA';
    };

    comenzarJuego();
    
});


botonPedirCarta.addEventListener("click", ()=>{
    if (!persona || !estadoPartida){
        mensajePartida.textContent = 'Partida NO comenzada';
    }else if (!persona.turno){
        mensajePartida.textContent = 'No es tu turno';
        
    }else{
        persona.pideCarta(baraja[n_carta]);
    };

});

botonPlantarse.addEventListener("click", () => {
    if (!persona || !estadoPartida) {
        mensajePartida.textContent = 'Partida NO comenzada';
    } else if (persona.turno) {
        persona.plantarse();
        maquina.maquinaJugar();
    } else {
        mensajePartida.textContent = 'No es tu turno';
    };
});


async function comenzarJuego(){
    estadoPartida = true;
    persona.turno = true;
    await cargarBaraja();

};


function restableceContenido(){

    n_carta = 0;
    
    // Reiniciar los datos de la ronda
    if (persona) {
        persona.cartas = [];
        persona.puntosRonda = 0;
        persona.estaPlantado = false;
        persona.gana = false;
    }
    if (maquina) {
        maquina.cartas = [];
        maquina.puntosRonda = 0;
        maquina.estaPlantado = false;
        maquina.gana = false;
    }
    
    textoPuntosPersona.textContent = 'PUNTOS';
    textoPuntosMaquina.textContent = 'PUNTOS';
    const canvasJugador = document.getElementById('canva-Jugador');
    const canvasMaquina = document.getElementById('canva-Máquina');

    //Limpia el canvas
    [canvasJugador, canvasMaquina].forEach(c => {
        c.width = c.width;   
        c.height = c.height; 
    });

};

function reiniciarPartida(){

};


let persona = new jugador();
let maquina = new JugadorMaquina();
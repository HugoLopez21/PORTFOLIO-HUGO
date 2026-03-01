
//El tamaño del barco son sus vidas
const barcos = [5,4,4,3,3,3,2,2,1,1,1,1]
let vidasBarcos = [...barcos];
let partida = true;
let turnos = 50
const medida = 10;

const gameBoard = document.getElementById('gameBoard')
const turnosRestantes = document.getElementById('turnos-restantes')

function showBoard() {
    //Crea el tablero visible en html y el asigna unas coordenadas
    for (let i = 0; i < medida; i++){
        for (let j = 0; j < medida; j++){
            const img = document.createElement('img');
            const casilla = document.createElement('div');
            casilla.className = 'cell';
            casilla.dataset.y = i;
            casilla.dataset.x = j;
            casilla.dataset.girada = false;
            img.src = 'images/question.png';
            img.alt = 'fondo base';
            casilla.appendChild(img);
            gameBoard.appendChild(casilla);

        }
    }
}

function tableroSecreto(){
    //Crea el tablero que contiene la posicion de los barcos
    // Por defecto en 0
    for (let i = 0; i < medida; i++) {
        boardSecret[i] = [];
        for (let j = 0; j < medida; j++) {
            boardSecret[i][j] = 0;
        }
    }
}


function comprobarEspacio(barco, fila, columna, eje){
    //Recibe el tamaño del barco, la cordenada y el eje
    //Si el numero es 0 es que no hay barco
    let espacioLibre = true;
    for (let i = 0; i < barco; i++){
        if (eje === 0){
            //Si el eje es horizontal
            if (boardSecret[fila][columna + i] !== 0){
                espacioLibre = false;
                break;
            }
        }
        else {
            if (boardSecret[fila + i][columna] !== 0){
                espacioLibre = false;
                break;
            }
        }
    }
    return espacioLibre;
}

function colocarBarco(barco){
    //Seleccionar aleatorioamente eje 
    const eje = Math.floor (Math.random() * 2); //0 horizontal 1 vertical
    let fila;
    let columna;  

    //Dependiendo del eje seleccionado aleatoriamente, seleccionamos las coordenadas
    if (eje === 0){
        fila = Math.floor (Math.random() * medida);
        //Comprueba que no se pasa del limite del tablero
        columna = Math.floor (Math.random() * (medida - barco + 1)); 
    }
    else { 
        fila = Math.floor (Math.random() * (medida - barco + 1));
        columna = Math.floor (Math.random() * medida); 
    }

    //Si hay esapcio diponible coloca el barco, si no vuelve a llamar a la funcion
    if (comprobarEspacio(barco, fila, columna, eje)){
        for (let i = 0; i < barco; i++){
            if (eje === 0){
                //Eje horizontal
                boardSecret[fila][columna + i] = barco;
            }
            else{
                //Eje vertical
                boardSecret[fila + i][columna] = barco;
            }
        }
    }
    else {
        colocarBarco(barco);
    }
}

function asignarBarcos(){
    //Recorre la lista de todos los barcos y ejecuta la funcion para hcerlo aleatoriamente
    for (let i = 0; i < barcos.length; i++){
        colocarBarco(barcos[i]);
    }
    return boardSecret;
}

function actualizarBarcos(barco){
    // Cuenta cuántos barcos del mismo tamaño quedan sin hundir
    const barcosRestantes = barcos.filter(b => b === barco).length;
    const ids = { 5: 'portaaviones', 4: 'acorazado', 3: 'destructor', 2: 'fragata', 1: 'submarino' };
    document.querySelector(`#${ids[barco]} .contador`).textContent = barcosRestantes;
}

function tocarBarco(barco){
    //Restamos la vida en la copia de la lista de barcos
    //Si llega a 0, el primer barco de ese tamaño se elimina de la lista original
    posicion = barcos.indexOf(barco);
    vidasBarcos[posicion] -= 1;
    if (vidasBarcos[posicion] === 0){
        barcos[barcos.indexOf(barco)] = 0;
        actualizarBarcos(barco);
        alert(`Has hundido un barco`);
    }else {
        alert(`Has tocado un barco`);
    }
    console.log(vidasBarcos);
}

function comprobarCasilla(fila, columna){
    //Si la casilla no tiene 0 significa que hay barco por lo que ataca al barco
    if (boardSecret[fila][columna] !== 0){
        tocarBarco(boardSecret[fila][columna]);
        boardSecret[fila][columna] = 0;
        return true;
    }else {
        turnos -= 1;
        return false;
    }
}


gameBoard.addEventListener('click', (e)=>{
    //Recoge el elemento clicado
    if (turnos === 0 || !partida){ 
        return
    }
    else{
    
    const cell = e.target.closest('.cell');
    const fila = Number(cell.dataset.y);
    const columna = Number(cell.dataset.x);
    const girada = cell.dataset.girada;
    
    if (girada === 'false'){
        cell.dataset.girada = 'true';
        const acierto = comprobarCasilla(fila, columna);
        const img = cell.querySelector('img');
        
        //Cambia la imagen segun acierto o fallo
        img.src = acierto ? 'images/ship.png' : 'images/waves.png';

        //Ejecuta la anim
        cell.classList.add(acierto ? 'acertado' : 'fallado');
    }
    estadoPartida();
    turnosRestantes.textContent = turnos
    }
});

function estadoPartida(){
    const mensajeEstado = document.getElementById('mensaje-final');
    if (barcos.every(barco => barco === 0)){
        mensajeEstado.textContent = '¡Has ganado! ¡Has hundido todos los barcos!';
        partida = false;
    }else if (turnos === 0){
        mensajeEstado.textContent = '¡Has perdido! No te quedan turnos.';
    }
}

function iniciarJuego(){
    boardSecret = [];
    showBoard();
    tableroSecreto();
    asignarBarcos();
    console.log(boardSecret);
}

iniciarJuego(); 
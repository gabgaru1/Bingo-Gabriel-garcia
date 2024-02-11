// Ante todo la honestidad, con el tiempo que nos dieron este micro-proyecto es una sinverguenzura. 
// Este es toda la funcionalidad del bingo, matrices, jugadores, leaderboard, etc.
function menu(){
    let x = 1;
    let listajugadores = [];
    console.log("bienvenido, Elija la cantidad de casillas del tablero");
    let casillas = prompt(': ');
    console.log("Ahora, introduce los nombres de los jugadores");
    while (x < 5) {
        let n = prompt(`Introduce el nombre del jugador ${x}: `);
        listajugadores.push(n);
        x++;
    }
    let instancia = new bingo(casillas, listajugadores);
    instancia.iniciar_juego();
}

class carton {
    constructor(ncasillas) {
        let matriz = [];
        for (let fila = 0; fila < ncasillas; fila++) {
            matriz[fila] = [];
            for (let columna = 0; columna < ncasillas; columna++) {
                matriz[fila][columna] = Math.floor(Math.random() * 50) + 1;
            }
        }
        this.matriz = matriz;
    }
}

class jugador {
    constructor(innombre, carton) {
        this.nombre = innombre;
        this.carton = carton;
        this.puntos = 0;
        this.victorias =0;
    }

    Nin_Casilla(N) {
        let encontrado = false;
        for (let fila = 0; fila < this.carton.matriz.length; fila++) {
            for (let columna = 0; columna < this.carton.matriz[fila].length; columna++) {
                if (this.carton.matriz[fila][columna] === N) {
                    this.carton.matriz[fila][columna] = 'X';
                    return true;
                }
            }
        }
        return false;
    }

    Mostrar_carton() {
        console.log(this.nombre);
        for (let fila = 0; fila < this.carton.matriz.length; fila++) {
            let filaStr = "";
            for (let columna = 0; columna < this.carton.matriz[fila].length; columna++) {
                filaStr += this.carton.matriz[fila][columna] + " ";
            }
            console.log(filaStr)
        }
    }

    carton_lleno() {
        for (let fila = 0; fila < this.carton.matriz.length; fila++) {
            for (let columna = 0; columna < this.carton.matriz[fila].length; columna++) {
                if (this.carton.matriz[fila][columna] !== 'X') {
                    return false;
                }
            }
        }
        return true;
    }
    Sumarpuntos() {
        let total = 0;
        let diag1 = [];
        let diag2 = [];
        // Lineas horizontales
        for (let fila = 0; fila < this.carton.matriz.length; fila++) {
            if (this.carton.matriz[fila].every(elemento => elemento === 'X')) {
                this.puntos += 1;
            }
        }
        // Lineas verticales
        for (let fila = 0; fila < this.carton.matriz.length; fila++) {
            let columnaActual = [];
            for (let columna = 0; columna < this.carton.matriz[fila].length; columna++) {
                columnaActual.push(this.carton.matriz[fila][columna]);
            }
            if (columnaActual.every(elemento => elemento === 'X')) {
                this.puntos += 1;
            }
        }
        // Lineas Diagonales
        for (let fila = 0; fila < this.carton.matriz.length; fila++) {
            diag1.push(this.carton.matriz[fila][fila]);
            diag2.push(this.carton.matriz[fila][this.carton.matriz.length - fila - 1]);
        }
        if (diag1.every(elemento => elemento === 'X')) {
            this.puntos += 3;
        }
        if (diag2.every(elemento => elemento === 'X')) {
            this.puntos += 3;
        }
    }

}

class bingo {
    constructor(casillas, jugadores) {
        this.nombresjugadores = jugadores;
        this.ncasillas = casillas;
        this.lista_jugadores = [];
        if (localStorage.getItem('Leaderboard')===null){
            this.leaderboard = [];
        }else{
            this.leaderboard=localStorage.getItem('Leaderboard');
        }
        this.nums = [];
    }

    nuevo_num() {
        //Genera un nuevo num random, no repetible
        let Num;
        do {
            Num = Math.floor(Math.random() * 50) + 1;
        } while (this.nums.includes(Num));
        this.nums.push(Num);
        return Num;
    }

    nueva_ronda(turnos) {
        let Num = this.nuevo_num();
        console.log(Num);
        //Revisa si cada jugador tiene el num e imprime su carton
        for (let player of this.lista_jugadores) {
            player.Nin_Casilla(Num)
            if (turnos === 16) {
                if (player.carton_lleno()) {
                    player.victorias+1;
                    player.puntos+5;
                    this.finalizar_juego();
                }
            }
            player.Mostrar_carton()
        }
        return turnos - 1;
    }

    finalizar_juego() {
        for (let player of this.lista_jugadores){
            player.Sumarpuntos()
            this.leaderboard.push(player);
        }
        this.leaderboard.sort((a,b)=>b.victorias - a.victorias);
        console.log(this.leaderboard);
        localStorage.setItem('Leaderboard',this.leaderboard);
    }

    iniciar_juego() {
        for (let player of this.nombresjugadores) {
            this.lista_jugadores.push(new jugador(player, new carton(this.ncasillas)));
        }
        let turnos = 25
        while (turnos > 0) {
            turnos = this.nueva_ronda(turnos);
        }
        this.finalizar_juego()
    }
}
menu()
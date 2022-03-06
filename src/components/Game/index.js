import React from "react";
import Board from "../Board";
import './game.css';

import logo from '../../assets/logo.png';
import jogo from '../../assets/jogo.png';
import historico from '../../assets/historico.png';

//Determina o ganhador do jogo
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 8],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[c] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            history: [{ // Históricos da partida, iniciando com espaços vazios
                squares: Array(9).fill(null), 
            }],
            stepNumber: 0, // Determina a jogada em que você está
            xIsNext: true,
        };
    }

    handleClick(i){ 
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); // Cria uma array que armazena o histórico do nosso jogo

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? "X" : "O";

        this.setState({
            history: history.concat([{squares: squares,}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // Trocar de jogador 
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0, 
        })
    }  


    render() {
        const history = this.state.history; // Peguei todo o objeto "histórico" e coloquei na variável history
        const current = history[this.state.stepNumber]; // Colocamos o array dos squares utilizando o stepNumber na current (atual)
        const winner = calculateWinner(current.squares); // Utilizando o calculateWinner, verificamos o array current
        
        // O moves, constrói os botões do histórico
        const moves = history.map((step, move)=>{
            const desc = move ? 
            'Vá para a jogada #' + move:
            'Vá para o início do jogo';
            return (
                <li key={move}>
                    <button className="historyButton" onClick={()=>this.jumpTo(move)}> 
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'GANHADOR: ' + winner;
        } else {
            status = 'PRÓXIMO JOGADOR: ' + (this.state.xIsNext ? 'X' : 'O');
        } 

        return(
            <div className="game">
                <div className="margin">
                    <img id="imgjogo" src={jogo} alt="Jogo da Velha" />
                    <img src={logo} alt="Jogo da velha - Logo" />
                </div>
                <div>
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div>
                    <h2>{status}</h2>
                </div>
                <div className="margin">
                    <img src={historico} alt="Histórico de Jogadas"/>
                    <ol className="margin">{moves}</ol>
                </div>
            </div>
        );
    }
}

export default Game;
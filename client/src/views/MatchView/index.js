import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";
import './styles.css';
import Navigation from '../../components/Navigation';

const MatchView = ({ history }) => {
    const socket = useSelector(({ socket }) => socket);
    const session = useSelector(({ session }) => session);
    const match = useSelector(({ match }) => match);
    const [matchId, setMatchId] = useState();
    const [gameState, setGameState] = useState(["", "", "", "", "", "", "", "", ""]);
    let [lastSymbol, setLastSymbol] = useState("O");
    const [symbol, setSymbol] = useState();
    const location = useLocation();
    let gameActive = true;
    let url = window.location.pathname;
    let thisMatchId = url.substring(url.lastIndexOf('/') + 1);

    useEffect(() => {
        setMatchId(location.state.matchId);

        socket.on('assign_symbol', symbol => {
            setSymbol(symbol);
        });

        socket.on('disconnected_user', userId => {
            userDisconnected(userId);
        });

        socket.on('game_move', (symbol, idx) => {
            gameState[idx] = symbol;
            setGameState(gameState);
            setLastSymbol(lastSymbol => lastSymbol === "X" ? "O" : "X");
            let element = document.getElementById('game-container').children;
            element.item(idx).innerHTML = symbol;
        });

        socket.on('match_ended', (matchID, winner) => {
            if (!winner) {
                matchTied();
            }
            if (matchID === thisMatchId) {
                setTimeout(function () {
                    matchEnded(winner)
                }, 1000)
            }
        });

        return () => {
            socket.off('game_move');
            socket.off('match_ended');
            socket.off('assign_symbol');
            socket.off('disconnected_user');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);

    const userDisconnected = (userId) => {
        if (match.participants.includes(u => u.userID === userId)) {
            const disconnectedUser = match.participants.find(user => user.userID === userId);
            alert(disconnectedUser.username + " has disconnected. Press OK to go back to the dashboard.");
            history.push("/dashboard");
        }
    };

    const matchEnded = (winner) => {
        if (winner) {
            if (winner.username === session.username) {
                alert("You have won the game! Press OK to go back to the dashboard.");
            } else {
                alert(winner.username + " has won the game! Press OK to go back to the dashboard.");
            }
        } else {
            alert("It's a tie! Press OK to go back to the dashboard.");
        }
        history.push("/dashboard");
    };

    const matchTied = () => {
        let element = document.getElementById('game-container').children;

        element.item(0).style.background = "#DC143C";
        element.item(1).style.background = "#DC143C";
        element.item(2).style.background = "#DC143C";
        element.item(3).style.background = "#DC143C";
        element.item(4).style.background = "#DC143C";
        element.item(5).style.background = "#DC143C";
        element.item(6).style.background = "#DC143C";
        element.item(7).style.background = "#DC143C";
        element.item(8).style.background = "#DC143C";
    };

    if (match) {

        let playerX = match.participants.find(player => player.symbol === "X");
        let playerO = match.participants.find(player => player.symbol === "O");

        const ready = () => {
            document.getElementById("ready-div-wrap").style.display = "none";
            socket.emit('ready', matchId);
        };

        const changeGameState = (clickedBoxIndex) => {
            gameState[clickedBoxIndex] = symbol;
            let element = document.getElementById('game-container').children;
            element.item(clickedBoxIndex).innerHTML = symbol;
        };

        const winningConditions = [
            [0, 1, 2],  // Top row
            [3, 4, 5],  // Middle row
            [6, 7, 8],  // Bottom row
            [0, 3, 6],  // Left column
            [1, 4, 7],  // Middle column
            [2, 5, 8],  // Right column
            [0, 4, 8],  // Top left corner to bottom right corner
            [2, 4, 6]   // Top right corner to bottom left corner
        ];

        const checkIfGameOver = (clickedBoxIndex) => {
            let roundWon = false;

            for (let i = 0; i <= 7; i++) {
                const winCondition = winningConditions[i];
                let a = gameState[winCondition[0]];
                let b = gameState[winCondition[1]];
                let c = gameState[winCondition[2]];
                if (a === '' || b === '' || c === '') {
                    continue;
                }
                if (a === b && b === c) {
                    // eslint-disable-next-line no-unused-vars
                    roundWon = true;
                    break
                }
            }
            if (roundWon) {
                gameActive = false;
                socket.emit('game_move', matchId, symbol, clickedBoxIndex, true, false);
                return true;
            }

            let roundDraw = !gameState.includes("");

            if (roundDraw) {
                gameActive = false;
                socket.emit('game_move', matchId, symbol, clickedBoxIndex, false, true);
                return true;
            }
            socket.emit('game_move', matchId, symbol, clickedBoxIndex, false, false);
        };

        const boxClicked = (clickedBoxEvent) => {
            if (lastSymbol !== symbol) {
                const clickedBox = clickedBoxEvent.target;
                const clickedBoxIndex = parseInt(
                    clickedBox.getAttribute('box-index')
                );
                if (gameState[clickedBoxIndex] !== "" || !gameActive) {
                    return;
                }
                changeGameState(clickedBoxIndex);
                checkIfGameOver(clickedBoxIndex);
            }
        };

        return (
            <div className="match-view">
                <Navigation history={history}/>
                <section>
                    <h1 className="game-title">Tic Tac Toe</h1>
                    <h2>{playerX.username} vs. {playerO.username}</h2>
                    <h2>Your symbol is: {symbol}</h2>
                    <div id="ready-div-wrap">
                        <button className="ready-button" onClick={() => ready()}>I'm ready!</button>
                    </div>
                    <div id="game-container">
                        <div box-index="0" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="1" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="2" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="3" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="4" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="5" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="6" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="7" className="box" onClick={(e) => boxClicked(e)}/>
                        <div box-index="8" className="box" onClick={(e) => boxClicked(e)}/>
                    </div>
                    {
                        symbol
                        ?
                            lastSymbol === "X"
                            ?
                                symbol !== lastSymbol
                                ?
                                    <div className="whose-turn">It's <span className="player">your</span> turn.</div>
                                :
                                    <div className="whose-turn">It's <span className="player">{playerO.username}'s</span> turn.</div>
                            :
                                symbol !== lastSymbol
                                ?
                                    <div className="whose-turn">It's <span className="player">your</span> turn.</div>
                                :
                                    <div className="whose-turn">It's <span className="player">{playerX.username}'s</span> turn.</div>
                        :
                            <></>
                    }
                </section>
            </div>
        );
    } else {
        return (
            <div>Waiting for matches to load...</div>
        )
    }
};

export default MatchView;

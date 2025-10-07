import React, { useState } from 'react'
import type { action, boardSettings, difficulty, gameStats } from '../types/types';

type modalProps = {
    settings: boardSettings;
    setModalShown: React.Dispatch<React.SetStateAction<boolean>>;
    dispatch: React.Dispatch<action>;
    difficulty: difficulty;
    gameStats: gameStats;
}
export default function Modal({settings, dispatch, setModalShown, difficulty, gameStats}: modalProps) {
    const [selectedDifficulty, setSelectedDifficulty] = useState<difficulty>(difficulty);
    function handleClose(){
        setModalShown(false);
        if(difficulty !== selectedDifficulty){
            dispatch({type: "CHANGE_BOARDCONFIG", difficulty: selectedDifficulty})
        }
    }
    return (
        <div className='modal'>
            <h2>Settings</h2>
            {Object.keys(gameStats).length !== 0 ?
            <div className='game-stats'>
                <div className='game-stats-header'>
                    <div>Difficulty</div>
                    <div>Wins</div>
                    <div>Losses</div>
                    <div>Win %</div>
                    <div>Best time</div>
                </div>

                {
                    Object.keys(gameStats).map(difficulty => {
                        const wins = gameStats[difficulty as difficulty]!.wins;
                        const losses = gameStats[difficulty as difficulty]!.losses;
                        const bestTime = gameStats[difficulty as difficulty]!.bestTime;
                        return (
                            <React.Fragment key={difficulty}>
                                <div>{difficulty}</div>
                                <div>{wins}</div>
                                <div>{losses}</div>
                                <div>{Math.floor(wins*100 / (wins+losses))}%</div>
                                <div>{bestTime === Number.MAX_VALUE ? "" : bestTime}</div>
                            </React.Fragment>
                        )
                    })
                }
            </div>
            : "game stats will appear here"}
            <div className='explainer'>
                <h3>What do these emojis mean?</h3>
                <div>
                    <img src="./happy.svg" width={55} alt="" />
                    <p>Game is on!</p>
                </div>
                <div>
                    <img src="./sad.svg" width={55} alt="" />
                    <p>You lost!</p>
                </div>
                <div>
                    <img src="./party.svg" width={55} alt="" />
                    <p>You won!</p>
                </div>
            </div>
            <div className='game-settings'>
                <h3>Select difficulty</h3>
                {Object.keys(settings).map((difficulty) => {
                    return (
                        <React.Fragment key={difficulty}>
                            <div>
                                <input type="radio" name='board-setting' id={difficulty} value={difficulty} onChange={(e) => setSelectedDifficulty(e.target.value as difficulty)} checked={selectedDifficulty === difficulty}/>
                                <label htmlFor={difficulty}>{difficulty} </label>
                            </div>
                            <div className='board-size-info'>
                                {`${settings[difficulty as difficulty].rows} x ${settings[difficulty as difficulty].columns}`}
                            </div>
                            <div>
                                {`mines: ${settings[difficulty as difficulty].mines}`}
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
            <button className='close-modal' onClick={handleClose}><img src='./close.svg'></img></button>
        </div>
    )
}

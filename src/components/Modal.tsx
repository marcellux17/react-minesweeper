import React, { useState } from 'react'
import type { boardSettings, difficulty } from '../state/types';

type modalProps = {
    settings: boardSettings;
    handleClose: (selectedDiffifulty: difficulty) => void;
    difficulty: difficulty;
}
export default function Modal({settings, handleClose, difficulty}: modalProps) {
    const [selectedDifficulty, setSelectedDifficulty] = useState<difficulty>(difficulty);
    return (
        <div className='modal'>
            <h2>Settings</h2>
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
            <div className='game-stats'>game stats will appear here</div>
            <button className='close-modal' onClick={() => handleClose(selectedDifficulty)}><img src='./close.svg'></img></button>
        </div>
    )
}

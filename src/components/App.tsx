import { useReducer, useState } from 'react'
import Board from './Board';
import Modal from './Modal';
import ToolBar from './ToolBar';
import settings from '../state/boardSettings';
import type { difficulty } from '../state/types';
import { generateTiles } from '../utils/gameHelpers';
import reducer from '../state/gameReducer';
import useTimer from '../hooks/useTimer';

export default function App() {
    const initialDifficulty:difficulty = "Intermediate";
    const [game, dispatch] = useReducer(reducer, {
        difficulty: initialDifficulty,
        status: "going",
        boardConfig: settings[initialDifficulty],
        tool: "reveal",
        tiles: generateTiles(settings[initialDifficulty]),
        flagsPlaced: 0,
        revealedTiles: 0,
        timerTrigger: "off",
        time: 0,
    });
    const [modalShown, setModalShown] = useState<boolean>(false);
    useTimer(dispatch, game.timerTrigger);

    function handleModalClose(selectedDifficulty: difficulty):void{
        setModalShown(false);
        if(game.difficulty !== selectedDifficulty){
            dispatch({type: "CHANGE_BOARDCONFIG", difficulty: selectedDifficulty});
        }
    }
    return (
        <>
            {modalShown && <Modal settings={settings} handleClose={handleModalClose} difficulty={game.difficulty}></Modal>}
            <main>
                    <ToolBar setModalShown={setModalShown} dispatch={dispatch} game={game} time={game.time}></ToolBar>
                    <Board game={game} dispatch={dispatch}></Board>
            </main>
        </>
    )
}



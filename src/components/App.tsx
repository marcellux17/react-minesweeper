import { useReducer, useState } from 'react'
import Board from './Board';
import Modal from './Modal';
import ToolBar from './ToolBar';
import settings from '../state/boardSettings';
import type { difficulty } from '../types/types';
import { generateTiles } from '../utils/gameHelpers';
import reducer from '../state/gameReducer';
import useTimer from '../hooks/useTimer';
import useGameStats from '../hooks/useGameStats';

export default function App() {
    const initialDifficulty:difficulty = "Beginner";
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
    const gameStats = useGameStats(game);

    return (
        <>
            {modalShown && <Modal settings={settings} dispatch={dispatch} setModalShown={setModalShown} difficulty={game.difficulty} gameStats={gameStats}></Modal>}
            <main>
                    <ToolBar setModalShown={setModalShown} dispatch={dispatch} game={game} time={game.time}></ToolBar>
                    <Board game={game} dispatch={dispatch}></Board>
            </main>
        </>
    )
}



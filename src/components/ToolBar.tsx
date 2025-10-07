import type { action, gameState } from '../types/types';
import React from "react";

type toolBarProps = {
    game: gameState;
    setModalShown: React.Dispatch<React.SetStateAction<boolean>>;
    dispatch: React.Dispatch<action>;
    time: number;
}
export default function ToolBar({game, setModalShown, dispatch, time}:toolBarProps) {
    return (
        <div className='toolbar'>
            <div className='flags-available'>
                <img src='./flag.svg' width={30}></img>
                {game.boardConfig.mines - game.flagsPlaced}
            </div>
            <div className='tools'>
                <button onClick={() => setModalShown(true)}><img src='./settings.svg' width="70%"></img></button>
                <button onClick={() => dispatch({ type: "NEW_GAME" })}>
                    {game.status === "going" ? <img src='./happy.svg' width="100%"></img> : 
                        game.status === "won" ? <img src='./party.svg' width="80%"></img> : <img src='./sad.svg' width="100%"></img>}
                </button>
                <button onClick={() => dispatch({ type: "CHANGE_TOOL", tool: game.tool === "flag" ? "reveal" : "flag" })}>
                    {game.tool === "flag" ? <img src='./flag.svg' width="80%"></img> : <img src='./bomb.svg' width="80%"></img>}
                </button>
            </div>
            <div className='time'>
                <img src='./timer.svg' width="60%"></img>
                {time === 0 ? "" : time}
            </div>
        </div>
    );
}
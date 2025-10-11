/// <reference types="vite-plugin-svgr/client" />

import type { action, gameState } from '../types/types';
import React from "react";
import TimerImage from '../assets/timer.svg?react';
import Bomb from '../assets/bomb.svg?react';
import Flag from '../assets/flag.svg?react';
import PartyFace from '../assets/party.svg?react'
import SadFace from '../assets/sad.svg?react';
import HappyFace from '../assets/happy.svg?react';
import SettingsIcon from '../assets/settings.svg?react'

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
                <Flag width={30} />
                {game.boardConfig.mines - game.flagsPlaced}
            </div>
            <div className='tools'>
                <button onClick={() => setModalShown(true)}><SettingsIcon width={"70%"} /></button>
                <button onClick={() => dispatch({ type: "NEW_GAME" })}>
                    {game.status === "going" ? <HappyFace width={"100%"} /> : 
                        game.status === "won" ? <PartyFace width={"80%"} /> : <SadFace width={"100%"} />}
                </button>
                <button onClick={() => dispatch({ type: "CHANGE_TOOL", tool: game.tool === "flag" ? "reveal" : "flag" })}>
                    {game.tool === "flag" ? <Flag width={"80%"} /> : <Bomb width={"80%"} />}
                </button>
            </div>
            <div className='time'>
                <TimerImage width={"65%"} />
                {time === 0 ? "" : time}
            </div>
        </div>
    );
}
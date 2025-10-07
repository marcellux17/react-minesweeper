import { useEffect, useState } from "react";
import { produce } from "immer";
import {type gameState, type gameStats} from "../types/types";

export default function useGameStats(game: gameState) {
    const [gameStats, setGameStats] = useState<gameStats>({});
    useEffect(() => {
        if(game.status === "won"){
            if(gameStats[game.difficulty]){
                setGameStats(prevGameStats => {
                    return produce(prevGameStats, draft => {
                        draft[game.difficulty]!.bestTime = draft[game.difficulty]!.bestTime > game.time ? game.time : draft[game.difficulty]!.bestTime;
                        draft[game.difficulty]!.wins++;
                    })
                })
            }else{
                setGameStats(prevGameStats => {
                    return produce(prevGameStats, draft => {
                        draft[game.difficulty] = {bestTime: game.time, losses: 0, wins: 1};
                    })
                })
            }
        }
        if(game.status === "over"){
            if(gameStats[game.difficulty]){
                setGameStats(prevGameStats => {
                    return produce(prevGameStats, draft => {
                        draft[game.difficulty]!.losses++;
                    })
                })
            }else{
                setGameStats(prevGameStats => {
                    return produce(prevGameStats, draft => {
                        draft[game.difficulty] = {bestTime: Number.MAX_VALUE, losses: 1, wins: 0};
                    })
                })
            }
        }
    }, [game.status]);

    useEffect(() => {
        if(Object.keys(gameStats).length === 0)return;
        localStorage.setItem("react-minesweeper-data", JSON.stringify(gameStats));
    }, [gameStats]);

    useEffect(() => {
        const storageItem = localStorage.getItem("react-minesweeper-data");
        if(storageItem){
            setGameStats(JSON.parse(storageItem));
        }
    }, []);
    return gameStats
}

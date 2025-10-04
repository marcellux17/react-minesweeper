import settings from "./boardSettings";
import type { gameState, action } from '../types/types';
import { generateTiles, revealArea, revealMines, revealTile, toggleFlag } from "../utils/gameHelpers";

export default function reducer(state: gameState, action: action): gameState{
    if(action.type === "CHANGE_BOARDCONFIG"){
        return {
            difficulty: action.difficulty,
            status: "going",
            boardConfig: settings[action.difficulty],
            tool: "reveal",
            tiles: generateTiles(settings[action.difficulty]),
            flagsPlaced: 0,
            revealedTiles: 0,
            timerTrigger: "off",
            time: 0,
        };
    }
    if(action.type === "CHANGE_TOOL"){
        return {...state, tool: action.tool};
    }
    if(action.type === "NEW_GAME"){
        return {
            difficulty: state.difficulty,
            status: "going",
            boardConfig: settings[state.difficulty],
            tool: "reveal",
            tiles: generateTiles(settings[state.difficulty]),
            flagsPlaced: 0,
            revealedTiles: 0,
            timerTrigger: "off",
            time: 0
        }
    }
    if(state.status === "over" || state.status === "won") return state;
    if(action.type === "CLICK_TILE"){
        const tile = state.tiles[action.coordinate.row][action.coordinate.column];
        if(state.tool === "reveal"){
            if(tile.flagOver) return state;
            if(tile.holds === "mine")return revealMines(state);

            if(tile.holds === "number" && tile.state !== "revealed")return revealTile(state, tile);

            if(tile.holds === "empty" && tile.state !== "revealed")return revealArea(state, tile);
        }else {
            if(tile.state === "revealed")return state;
            return toggleFlag(state, tile)
        }
    }
    if(action.type === "RIGHT_CLICK_TILE"){
        const tile = state.tiles[action.coordinate.row][action.coordinate.column];
        if(tile.state === "revealed")return state;
        return toggleFlag(state, tile);
    }
    if(action.type === "INCREMENT_TIME"){
        return {...state, time: state.time + 1};
    }
    return state;
}
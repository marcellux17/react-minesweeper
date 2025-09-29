import type { coordinate, tile, boardConfig, gameState } from "../types/types";
import { produce } from "immer";

export function generateMineCoordinates(boardConfig:boardConfig):coordinate[]{
    const mines:coordinate[] = [];
    let i = 0;
    while(i < boardConfig.mines){
        let row = Math.floor(Math.random()*boardConfig.rows);
        let column = Math.floor(Math.random()*boardConfig.columns);
        while(mines.some(mine => mine.row === row && mine.column === column)){
            row = Math.floor(Math.random()*boardConfig.rows);
            column = Math.floor(Math.random()*boardConfig.columns);
        }
        mines.push({row, column});
        i++;
    }
    return mines;
}
export function generateTiles(boardConfig: boardConfig):tile[][]{
    const mines = generateMineCoordinates(boardConfig);
    const tiles:tile[][] = [];
    for(let rowNumber = 0; rowNumber < boardConfig.rows; rowNumber++){
        const row:tile[] = [];
        for(let columnNumber = 0; columnNumber < boardConfig.columns; columnNumber++){
            row.push({holds: "empty", state: "hidden", coordinate: {row: rowNumber, column: columnNumber}, flagOver: false})
        }
        tiles.push(row);
    }
    for(const mine of mines){
        const surroundingTiles = getSurroundingTileCoordinates(mine, boardConfig).filter(tile => !mines.some(mine => mine.column === tile.column && mine.row === tile.row));
        tiles[mine.row][mine.column].holds = "mine";
        for(const tile of surroundingTiles){
            if(tiles[tile.row][tile.column].adjacentMines){
                tiles[tile.row][tile.column].adjacentMines!++;
            }else{
                tiles[tile.row][tile.column].adjacentMines = 1;
                tiles[tile.row][tile.column].holds = "number";
            }
        }
    }
    return tiles;
}
export function getSurroundingTileCoordinates(tileCoordinate: coordinate, boardConfig: boardConfig):coordinate[]{
    const surroundingTiles:coordinate[] = [];
    surroundingTiles.push({row: tileCoordinate.row-1, column: tileCoordinate.column-1});
    surroundingTiles.push({row: tileCoordinate.row-1, column: tileCoordinate.column});
    surroundingTiles.push({row: tileCoordinate.row-1, column: tileCoordinate.column+1});
    surroundingTiles.push({row: tileCoordinate.row+1, column: tileCoordinate.column-1});
    surroundingTiles.push({row: tileCoordinate.row+1, column: tileCoordinate.column});
    surroundingTiles.push({row: tileCoordinate.row+1, column: tileCoordinate.column+1});
    surroundingTiles.push({row: tileCoordinate.row, column: tileCoordinate.column-1});
    surroundingTiles.push({row: tileCoordinate.row, column: tileCoordinate.column+1});
    return surroundingTiles.filter(tile => (tile.column >= 0 && tile.column < boardConfig.columns && tile.row < boardConfig.rows && tile.row >= 0));

}
export function getRevealArea(tileCoordinate: coordinate, boardConfig:boardConfig, tiles: tile[][]):coordinate[]{
    const revealArea:coordinate[] = []
    const stack:coordinate[] = [];
    const visited = new Map<string, boolean>();

    stack.push(tileCoordinate);
    visited.set(`${tileCoordinate.column}-${tileCoordinate.row}`, true);
    
    while(stack.length !== 0){
        const currentTileCoordinate = stack.pop()!;
        revealArea.push(currentTileCoordinate);
        const neighbourTileCoordinates = getSurroundingTileCoordinates(currentTileCoordinate, boardConfig);
        if(tiles[currentTileCoordinate.row][currentTileCoordinate.column].holds === "number"){
            continue;
        }
        for(const neighbourCoordinate of neighbourTileCoordinates){
            const correspondingTile = tiles[neighbourCoordinate.row][neighbourCoordinate.column]
            if((!correspondingTile.flagOver) && (!visited.get(`${neighbourCoordinate.column}-${neighbourCoordinate.row}`)) && correspondingTile.state !== "revealed"){
                visited.set(`${neighbourCoordinate.column}-${neighbourCoordinate.row}`, true);
                stack.push(neighbourCoordinate);
            }
        }
    }

    return revealArea;
}    
export function revealMines(state: gameState): gameState {
    return produce(state, draft => {
        for (let rowNumber = 0; rowNumber < state.boardConfig.rows; rowNumber++) {
            for (let columnNumber = 0; columnNumber < state.boardConfig.columns; columnNumber++) {
                if (state.tiles[rowNumber][columnNumber].holds === "mine") {
                    draft.tiles[rowNumber][columnNumber].flagOver = false;
                    draft.tiles[rowNumber][columnNumber].state = "revealed";
                }
            }
        }
        draft.status = "over";
        draft.timerTrigger = "off";
    });
}
export function toggleFlag(state: gameState, tile: tile): gameState {
    return produce(state, draft => {
        if ((!draft.tiles[tile.coordinate.row][tile.coordinate.column].flagOver) && draft.flagsPlaced !== draft.boardConfig.mines) {
            draft.flagsPlaced++;
            draft.tiles[tile.coordinate.row][tile.coordinate.column].flagOver = true;
        } else if (draft.tiles[tile.coordinate.row][tile.coordinate.column].flagOver) {
            draft.flagsPlaced--;
            draft.tiles[tile.coordinate.row][tile.coordinate.column].flagOver = false;
        }
        if (draft.revealedTiles + draft.flagsPlaced === draft.boardConfig.columns * draft.boardConfig.rows) {
            draft.status = "won";
            draft.timerTrigger = "off";
            return;
        }
        if (draft.timerTrigger === "off") {
            draft.timerTrigger = "on";
            draft.time = 1;
        }
    });
}
export function revealArea(state: gameState, startingTile: tile): gameState {
    const tilesToBeRevealed = getRevealArea({row: startingTile.coordinate.row, column: startingTile.coordinate.column}, state.boardConfig, state.tiles);
    return produce(state, draft => {
        tilesToBeRevealed.forEach(tile => {
            draft.tiles[tile.row][tile.column].state = "revealed";
            draft.revealedTiles++;
            if (draft.revealedTiles + draft.flagsPlaced === draft.boardConfig.columns * draft.boardConfig.rows) {
                draft.status = "won";
                draft.timerTrigger = "off";
                return;
            }
            if (draft.timerTrigger === "off") {
                draft.timerTrigger = "on";
                draft.time = 1;
            }
        })
    })
}
export function revealTile(state: gameState, tile: tile):gameState{
    return produce(state, draft => {
        draft.tiles[tile.coordinate.row][tile.coordinate.column].state = "revealed";
        draft.revealedTiles++;
        if (draft.revealedTiles + draft.flagsPlaced === draft.boardConfig.columns * draft.boardConfig.rows) {
            draft.status = "won";
            draft.timerTrigger = "off";
            return;
        }
        if (draft.timerTrigger === "off") {
            draft.timerTrigger = "on";
            draft.time = 1;
        }
    })
}
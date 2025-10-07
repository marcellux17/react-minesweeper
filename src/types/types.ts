
export type boardConfig = {
    rows: number;
    columns: number;
    mines: number;
};
export type tile = {
    holds: "mine" | "number" | "empty";
    state: "revealed" | "hidden";
    adjacentMines?: number;
    coordinate: coordinate;
    flagOver: boolean;
};
export type tool = "flag" | "reveal";
export type coordinate = {
    row: number;
    column: number;
};
export type gameStatus = "over" | "going" | "won";
export type trigger = "on" | "off";
export type gameState = {
    difficulty: difficulty;
    status: gameStatus;
    tiles: tile[][];
    boardConfig: boardConfig;
    tool: tool;
    flagsPlaced: number;
    revealedTiles: number;
    timerTrigger: trigger;
    time: number;
};
export type difficulty = "Beginner" | "Intermediate" | "Expert";

export type boardSettings = {
    [D in difficulty]: boardConfig;
};
export type action = { type: "CHANGE_BOARDCONFIG"; difficulty: difficulty; } |
{ type: "CLICK_TILE"; coordinate: coordinate; } |
{ type: "CHANGE_TOOL"; tool: tool; } |
{ type: "RIGHT_CLICK_TILE"; coordinate: coordinate; } |
{ type: "NEW_GAME" }|
{ type: "INCREMENT_TIME"}
export type gameStat = {
    bestTime: number;
    losses: number;
    wins: number;
}
export type gameStats = {
    [D in difficulty]?: gameStat
}
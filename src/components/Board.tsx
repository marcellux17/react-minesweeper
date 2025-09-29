import type { gameState } from '../types/types';
import type { action } from '../types/types';
import Tile from './Tile'

type boardProps = {
    game: gameState;
    dispatch: React.Dispatch<action>;
}
export default function Board({game, dispatch}: boardProps) {
    const boardCells = game.tiles.map(row => {
        return row.map(tile => {
            return <Tile tile={tile} dispatch={dispatch} key={`${tile.coordinate.column}-${tile.coordinate.row}`} gameStatus={game.status}></Tile>
        })
    })
    return (
        <div className='board' style={
            {
                gridTemplateColumns: `repeat(${game.boardConfig.columns}, 1fr)`,
                gridTemplateRows: `repeat(${game.boardConfig.rows}, 1fr)`,
                aspectRatio: `${game.boardConfig.columns} / ${game.boardConfig.rows}`
            }
        }>
            {boardCells}
        </div>
    )
}

/// <reference types="vite-plugin-svgr/client" />

import type { action, gameStatus, tile } from '../types/types';
import Bomb from '../assets/bomb.svg?react';
import Flag from '../assets/flag.svg?react';
import WrongFlag from '../assets/wrong_flag.svg?react';

type tileProps = {
  tile: tile;
  dispatch: React.Dispatch<action>;
  gameStatus: gameStatus
}
export default function Tile({tile, dispatch, gameStatus}:tileProps) {
    let number;
    if(tile.state === "revealed" && tile.holds === "number"){
        number = tile.adjacentMines;
    }
    return (
        <div className={`tile ${tile.state === "revealed" ? "revealed" : "hidden"}`} onClick={() => dispatch({type: "CLICK_TILE", coordinate: tile.coordinate})} 
          onContextMenu={(e) => {
            e.preventDefault();
            dispatch({type: "RIGHT_CLICK_TILE", coordinate: tile.coordinate})
          }}
        >
          {<TileImage tile={tile} gameStatus={gameStatus} />}
          <p style={{fontWeight: 600}}>{number && number}</p>
        </div>
    )
}
function TileImage({tile, gameStatus}: {tile: tile, gameStatus: gameStatus}){
    if(tile.state === "revealed" && tile.holds === "mine"){
      return <Bomb width={"60%"}  />
    }
    if(gameStatus === "over" && tile.flagOver && tile.holds !== "mine"){
      return <WrongFlag width={"60%"}  />
    }
    if(tile.flagOver){
      return <Flag width={"60%"} />
    }
}

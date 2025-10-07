import type { action, gameStatus, tile } from '../types/types';

type tileProps = {
  tile: tile;
  dispatch: React.Dispatch<action>;
  gameStatus: gameStatus
}
export default function Tile({tile, dispatch, gameStatus}:tileProps) {
    let imgSource;
    let number;
    if(tile.state === "revealed"){
      if(tile.holds === "number"){
        number = tile.adjacentMines;
      }
      if(tile.holds === "mine"){
        imgSource = "./bomb.svg"
      }
    }
    if(tile.flagOver){
      imgSource = "./flag.svg";
    }
    if(gameStatus === "over"){
      if(tile.flagOver && tile.holds !== "mine"){
        imgSource = "./wrong_flag.svg"
      }
    }
    return (
        <div className={`tile ${tile.state === "revealed" ? "revealed" : "hidden"}`} onClick={() => dispatch({type: "CLICK_TILE", coordinate: tile.coordinate})} 
          onContextMenu={(e) => {
            e.preventDefault();
            dispatch({type: "RIGHT_CLICK_TILE", coordinate: tile.coordinate})
          }}
        >
          {imgSource && <img src={imgSource} width={`60%`} alt="" />}
          <p style={{fontWeight: 600}}>{number && number}</p>
        </div>
    )
}

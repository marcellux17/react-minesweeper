import { useEffect, useRef } from 'react'
import type { action, trigger } from '../types/types';

export default function useTimer(dispatch: React.Dispatch<action>, trigger: trigger) {
  const timerIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if(trigger === "on"){
            timerIntervalRef.current = setInterval(() => {
                dispatch({type: "INCREMENT_TIME"});
            }, 1000)
        }else{
            if(timerIntervalRef.current !== null){
                clearInterval(timerIntervalRef.current!);
            }
        }
        return () => {
            if(timerIntervalRef.current !== null){
                clearInterval(timerIntervalRef.current!);
            }
        };
    }, [trigger]);
}

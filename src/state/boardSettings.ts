import type { boardSettings } from "../types/types";
const settings: boardSettings = {
    "Beginner": {
        rows: 9,
        columns: 9,
        mines: 10
    },
    "Intermediate": {
        rows: 16,
        columns: 16,
        mines: 40
    },
    "Expert": {
        rows: 30,
        columns: 16,
        mines: 99
    }
};
export default settings;
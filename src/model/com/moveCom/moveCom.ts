interface MoveInfo {
    pos: Point;
    velocity: SAT.Vector;
}
interface MoveCom {
    destroy(): void;
}

type MoveUpdateFn = (move_info: MoveInfo) => void;

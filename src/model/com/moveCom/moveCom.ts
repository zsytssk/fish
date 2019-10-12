interface MoveInfo {
    pos: Point;
    velocity: SAT.Vector;
}
interface MoveCom {
    start(): void;
    stop(): void;
    destroy(): void;
}

type MoveUpdateFn = (move_info: MoveInfo) => void;

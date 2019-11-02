import { WebSocketTrait } from 'ctrl/net/webSocketWrap';
import { GameCtrl } from './gameCtrl';
import { ServerEvent } from 'data/serverEvent';

export function onGameSocket(socket: WebSocketTrait, game: GameCtrl) {
    const { event } = socket;
    event.on(
        ServerEvent.Hit,
        (data: HitRep) => {
            game.onHit(data);
        },
        game,
    );
}

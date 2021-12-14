import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

import {
    ArenaRoomStatus,
    ArenaStatus,
    type ArenaStatusData,
} from '@app/api/arenaApi';

export const ArenaModelEvent = {
    UpdateInfo: 'updateInfo',
};

export class ArenaModel extends ComponentManager {
    status: ArenaStatus;
    open_timezone: LocalRange;
    game_status: ArenaRoomStatus;
    constructor() {
    super();
        this.addCom(new EventCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public updateInfo(info: ArenaStatusData) {
        const { status, startDate, endDate } = info;
        this.status = status;
        this.open_timezone = [startDate, endDate];
        this.event.emit(ArenaModelEvent.UpdateInfo, this);
    }
}

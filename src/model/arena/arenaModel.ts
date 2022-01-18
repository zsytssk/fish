import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

import {
    ArenaGameStatus,
    ArenaStatus,
    type ArenaStatusData,
} from '@app/api/arenaApi';

export const ArenaModelEvent = {
    UpdateInfo: 'updateInfo',
};

export class ArenaModel extends ComponentManager {
    room_status: ArenaStatus;
    user_status: ArenaGameStatus;
    open_timezone: LocalRange;
    user_id:string;
    constructor() {
    super();
        this.addCom(new EventCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public updateInfo(info: ArenaStatusData) {
        if (!info) {
            this.event.emit(ArenaModelEvent.UpdateInfo, this);
            return;
        }
        const { roomStatus, userStatus, startDate,userId, endDate } = info;
        this.room_status = roomStatus;
        this.user_status = userStatus;
        this.user_id = userId;
        this.open_timezone = [startDate, endDate];
        this.event.emit(ArenaModelEvent.UpdateInfo, this);
    }
}

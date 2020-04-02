type SubProcessItem = Process | Func<Promise<any>>;

/** process 用来组织一个接一个的 任务(process) */
export abstract class Process {
    private cur_index: number;
    protected sub_process_list: SubProcessItem[] = [];
    public up_process: Process;
    public name: string;
    /** 设置子任务 */
    public setSubList(list: SubProcessItem[]) {
        for (const item of list) {
            if (item instanceof Process) {
                (item as Process).up_process = this;
            }
        }
        this.sub_process_list = list;
    }
    private findProcess(
        path: number | string,
    ): { process: SubProcessItem; index: number } {
        let process: SubProcessItem;
        let index: number;
        if (typeof path === 'number') {
            process = this.sub_process_list[path];
            index = path;
        } else {
            const { sub_process_list } = this;
            for (let i = 0; i < sub_process_list.length; i++) {
                const item = sub_process_list[i];
                if (item.name === path) {
                    index = i;
                    process = item;
                    break;
                }
            }
        }

        return {
            process,
            index,
        };
    }
    /** 跳到特定的一部 */
    public async goto(path_list: Array<string | number>) {
        const cur_path = path_list.shift();
        /** 如果是数字就表示是 sub_process_list中的第几个 */
        const { process, index } = this.findProcess(cur_path);

        if (!process) {
            console.log(`cant find process for ${this.name}:${cur_path}`);
            return;
        }

        this.cur_index = index;
        if (typeof process === 'function') {
            const result = process();
            if (result instanceof Promise) {
                await result;
            }
            return;
        }
        await process.start();
        if (path_list.length) {
            await process.goto(path_list);
        }
    }
    protected async next() {
        if (this.isCompleted()) {
            this.complete();
            return;
        }

        let index: number;
        /** 如果process_list还没有运行 */
        if (this.cur_index === undefined) {
            index = 0;
        } else {
            index = this.cur_index + 1;
        }

        return this.goto([index]);
    }

    /** 开始process 一些依赖条件 */
    public abstract async start(...params: any[]);

    /** process 是否完成 */
    private isCompleted() {
        const { sub_process_list, cur_index } = this;
        if (!sub_process_list.length) {
            return true;
        }
        if (cur_index >= sub_process_list.length - 1) {
            return true;
        }
        return false;
    }

    /** process 完成 */
    protected async complete(auto_next = true) {
        console.log(`guide: ${this.name} process completed`);
        if (this.up_process && auto_next) {
            this.up_process.next();
        }
    }
    public async clear() {
        const cur_process = this.sub_process_list[this.cur_index];
        if (cur_process instanceof Process) {
            await cur_process.clear();
            await cur_process.complete(true);
        }
    }
}

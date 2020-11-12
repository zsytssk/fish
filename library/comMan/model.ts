import { ComponentManager } from './component';

class Context {
    private pool: Set<Model>;
    public of<T extends Model>(className: Ctor<T>): T {
        for (const instance of this.pool) {
            if (instance instanceof className) {
                return instance;
            }
        }
        return null;
    }
    public inject<T extends Model>(instance: T) {
        this.pool.add(instance);
    }
    public reject<T extends Model>(instance: T) {
        this.pool.delete(instance);
    }
}

class Model extends ComponentManager {
    protected context: Context;
    constructor(context: Context) {
        super();
        this.context = context;
        context.inject(this);
    }
    destroy() {
        super.destroy();
        this.context.reject(this);
    }
}

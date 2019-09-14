export interface Component {
    destroy?(): void;
}

export class ComponentManager {
    private components: Set<Component>;
    public add(...com_list: Component[]) {
        for (const com of com_list) {
            this.components.add(com);
        }
    }
    public delete(...com_list: Component[]) {
        for (const com of com_list) {
            this.components.delete(com);
        }
    }
    public get(ctor: Ctor<Component>) {
        for (const com of this.components) {
            if (com instanceof ctor) {
                return com;
            }
        }
    }
    public destroy() {
        for (const com of this.components) {
            if (typeof com.destroy === 'function') {
                com.destroy();
            }
        }
        this.components.clear();
    }
}

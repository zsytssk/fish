type FuncVoid = () => void;
type Func<T> = (...params: any[]) => T;
type NotFunc<T> = T extends Function ? never : T;

type PropsOption<T> = { [key in keyof T]?: T[key] };
type FnKeys<T> = {
    [k in keyof T]: T[k] extends Function ? k : never;
}[keyof T];
type Ctor<T> = new (...param: any[]) => T;

type AnyObj = {
    [key: string]: any;
};

class A {
    x: number;
    y();
}

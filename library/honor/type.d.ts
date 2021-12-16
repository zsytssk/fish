/* eslint-disable @typescript-eslint/no-explicit-any */
type FuncVoid = () => void;
type Func<T> = (...params: any[]) => T;
type FuncAny = (...params: any[]) => any;
type NotFunc<T> = T extends (...args: any[]) => any ? never : T;

type Ctor<T> = new (...param: any[]) => T;

type AnyObj = {
    [key: string]: any;
};

type ObjFilterFlags<T, Condition> = {
    [k in keyof T]: T[k] extends Condition ? k : never;
};
type ObjFilterKeys<Base, Condition> = ObjFilterFlags<
    Base,
    Condition
>[keyof Base];

type ObjFilter<Base, Condition> = Pick<Base, ObjFilterKeys<Base, Condition>>;

type SplitLast<T extends any[]> = T extends [...infer I, infer L]
    ? [I, L]
    : never;

type NotLastParameters<T extends FuncAny> = SplitLast<Parameters<T>>[0];
type LastParameters<T extends FuncAny> = SplitLast<Parameters<T>>[1];

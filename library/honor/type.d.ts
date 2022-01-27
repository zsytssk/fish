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

type SplitLast<T extends any[]> = T extends [...infer I, (infer L)?]
    ? [I, L]
    : never;

type NotLastParameters<T extends FuncAny> = SplitLast<Parameters<T>>[0];
type LastParameters<T extends FuncAny> = SplitLast<Parameters<T>>[1];

type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

type UnpackArr<T> = T extends (infer K)[]
    ? K extends [infer K1, infer K2]
        ? [K1[], K2[]]
        : never
    : never;

// type A = [[T1, K1], [T2, K2],...];
// UnpackArrDeep<A> = [[T1, T2, ...], [K1, K2, ...]]
type UnpackArrDeep<T> = T extends [infer I, ...infer L]
    ? I extends [infer I1, infer I2]
        ? UnpackArrDeep<L> extends [infer L1, infer L2]
            ? [[I1, ...L1], [I2, ...L2]]
            : [[I1], [I2]]
        : never
    : T extends []
    ? []
    : UnpackArr<T>;

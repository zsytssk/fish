// type A = [number, string, () => void];

// type UnPackTest<T> = T extends [infer I, ...infer L]
//     ? [I, ...UnPackTest<L>]
//     : T extends []
//     ? []
//     : never;

// type C = UnPackTest<A>;

type A = [[number, string], [number, () => void]];

type C = UnpackArrDeep<A>;

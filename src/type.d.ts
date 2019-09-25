type FuncVoid = () => void;
type Point = {
    x: number;
    y: number;
};

// type ClassFnKeys<Type> = {
//     [Key in keyof InstanceType<Type>]: Type[Key] extends Function ? never : Key;
// }[keyof Type];

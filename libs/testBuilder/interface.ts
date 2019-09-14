export type TestConfig = {
    is_on: boolean;
};

/** 创建Test环境 */
export interface TestBuilder {
    findTest(scope: string): TestScope;
    runTest(scope: string);
    enableDisableTest(enable_list: string[], disable_list: string[]);
}

export type TestScopeStatus = 'normal' | 'running' | 'complete';
export type RunTest = (msg?: string, params?: any[]) => Promise<void>;
/** 组织所有的test  */
export interface TestScope {
    name: string;
    status: TestScopeStatus;
    config: TestConfig;
    children?: TestScope[];
    entity_list: TestEntity[];
    init(config: TestConfig): void;
    open(force: boolean): void;
    close(force: boolean): void;
    parseTest(): void;
    runTest: RunTest;
    addChild(...children: TestScope[]);
}

export enum TestResult {
    Fail = 'fail',
    Success = 'success',
}

export type TestScopeFun = (runner: TestUtil) => void | Promise<void>;

/** 运行Test函数的运行器 */
export interface TestUtil {
    describe(msg: string, test_fun: TestFun);
    it(msg: string, test_fun: TestFun);
    afterAll(fun: TestFun);
    beforeAll(fun: TestFun);
    afterEach(fun: TestFun);
    beforeEach(fun: TestFun);
}

export type TestFun = (...params: any[]) => void | Promise<void>;
export type TestItem = {
    msg: string;
    fun: TestFun;
};
export interface TestEntity {
    msg: string;
    fun: TestFun;
    children: TestEntity[];
    afterAll: TestFun[];
    beforeAll: TestFun[];
    afterEach: TestFun[];
    beforeEach: TestFun[];
    itemList: TestItem[];
}

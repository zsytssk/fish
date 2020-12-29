import honor from 'honor';

export function detectChangeScene() {
    const prev = honor.director.runningScene;

    return () => {
        if (honor.director.isLoadingScene) {
            return true;
        }
        if (prev !== honor.director.runningScene) {
            return true;
        }
        return false;
    };
}

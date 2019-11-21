export function getCacheBalance(user_id: string) {
    return localStorage.getItem(`${user_id}:balance`);
}
export function setCacheBalance(user_id: string, balance: string) {
    return localStorage.setItem(`${user_id}:balance`, balance);
}

export const storeInSession = (item, key) => {
    localStorage.setItem(key, item);
}

export const lookInSession = (key) => {
    return localStorage.getItem(key);
}

export const removeFromSession = (key) => {
    localStorage.removeItem(key);
}

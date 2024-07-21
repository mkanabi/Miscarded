// src/utils/session.js
export const saveSession = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  export const loadSession = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };
  
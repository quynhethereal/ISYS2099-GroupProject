import { useState } from "react";
import jwt_decode from "jwt-decode";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    if (newValue == null) {
      setStoredValue(newValue);
    } else {
      setStoredValue(jwt_decode(newValue.token));
    }
  };
  return [storedValue, setValue];
};

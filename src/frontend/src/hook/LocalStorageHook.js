import { useState } from "react";
import jwt_decode from "jwt-decode";

//this is for authentication

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(keyName);
      if (value) {
        return jwt_decode(JSON.parse(value).token);
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
      if (newValue == null) {
        localStorage.setItem(keyName, JSON.stringify(newValue));
      } else {
        localStorage.setItem(keyName, JSON.stringify(newValue));
        setStoredValue(jwt_decode(newValue.token));
      }
    } catch (err) {}
  };
  return [storedValue, setValue];
};

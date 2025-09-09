"use client"

import { useState, useEffect } from "react"

function getValue<T>(key: string, initialValue: T): T {
  // Prevent build errors by checking if window is defined
  if (typeof window === "undefined") {
    return initialValue
  }
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error)
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => getValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

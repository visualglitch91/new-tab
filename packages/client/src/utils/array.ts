export function removeItemAtIndex<T>(arr: T[], index: number): T[] {
  if (index < 0 || index >= arr.length) {
    // If the index is out of bounds, return the original array
    return arr;
  }

  // Create a new array that includes all elements before the index and all elements after the index
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function compareByStringProp<T>(prop: keyof T) {
  return (a: T, b: T) => {
    if (typeof a[prop] === "string") {
      //@ts-ignore
      return a[prop].localeCompare(b[prop]);
    }

    return 0;
  };
}

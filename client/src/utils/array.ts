export function removeItemAtIndex<T>(arr: T[], index: number): T[] {
  if (index < 0 || index >= arr.length) {
    // If the index is out of bounds, return the original array
    return arr;
  }

  // Create a new array that includes all elements before the index and all elements after the index
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function mergeWith<A, B>(a: A) {
  return (b: B) => {
    return { ...a, ...b };
  };
}

export function insertAtIndex<T>(array: T[], index: number, newItem: T): T[] {
  const newArray = [...array];
  newArray.splice(index, 0, newItem);
  return newArray;
}

export function getIdx(i: number, j: number, size: number): number {
  return i * size + j;
}

export function getPos(idx: number, size: number): [number, number] {
  return [Math.floor(idx / size), idx % size];
}

export function getNeighbors(idx: number, size: number): number[] {
  const res: number[] = [];
  if (idx >= size * 2) res.push(idx - size * 2);
  if (idx < size * (size - 2)) res.push(idx + size * 2);
  if (idx % size >= 2) res.push(idx - 2);
  if (idx % size < size - 2) res.push(idx + 2);
  return res;
}

export function shuffleArrayCopy<T>(arr: T[]): T[] {
  const shuf = arr.slice();
  for (let i = shuf.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuf[i], shuf[j]] = [shuf[j], shuf[i]];
  }

  return shuf;
}

export function normalizeVector(vec:number[]) {
    const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return vec.map(val => val / norm);
  }
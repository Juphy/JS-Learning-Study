export function toArray(list, start){
  start = start || 0;
  let i = list.length - start;
  const res = new Array(i);
  while(i--){
      res[i] = list[i+start]
  }
  return res;
}
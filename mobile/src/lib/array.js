export const makeChunks = (list, chunkSize = 200) => list.reduce((prev, current) => {
  if (prev[prev.length - 1].length < chunkSize) {
    prev[prev.length - 1].push(current);
  } else {
    prev.push([current]);
  }

  return prev;
}, [[]]);

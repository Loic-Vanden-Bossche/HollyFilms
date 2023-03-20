export const colors = [
  "#FADBD8",
  "#E8DAEF",
  "#D6EAF8",
  "#D1F2EB",
  "#D5F5E3",
  "#FCF3CF",
  "#FDEBD0",
  "#FAE5D3",
  "#F6DDCC",
  "#F2D7D5",
  "#EBDEF0",
  "#D4E6F1",
  "#D4EFDF",
  "#D0ECE7",
];

export const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getRandomizedColors = () => {
  const arrayCopy = colors.slice();
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};

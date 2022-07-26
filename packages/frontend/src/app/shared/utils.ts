const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
};

interface ColorMap {
  color: string;
  breakpoint: number;
}

const fromSecondsToImpreciseTime = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }

  return `${Math.floor(seconds / 3600)}h`;
};

const fromSecondsToTime = (secondsInput: number) => {
  const hours = Math.floor(secondsInput / 3600);
  const minutes = Math.floor((secondsInput - hours * 3600) / 60);
  const seconds = secondsInput - hours * 3600 - minutes * 60;

  if (hours > 0) {
    return `${Math.floor(hours) === 0 ? '' : Math.floor(hours) + 'h'}${
      Math.floor(minutes) === 0 ? '' : Math.floor(minutes) + 'm'
    }${
      Math.floor(seconds) === 0 || Math.floor(minutes) > 0
        ? ''
        : Math.floor(seconds) + 's'
    }`;
  } else {
    return `${Math.floor(minutes) === 0 ? '' : Math.floor(minutes) + 'm'}${
      Math.floor(seconds) === 0 ? '' : Math.floor(seconds) + 's'
    }`;
  }
};

const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export {
  toTitleCase,
  toSentenceCase,
  fromSecondsToImpreciseTime,
  fromSecondsToTime,
  shuffle,
  ColorMap,
};

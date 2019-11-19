const DEFAULT_GETTER = item => item;

const sortByKey = (getter = DEFAULT_GETTER) => {
  if (typeof getter === "string") {
    getter = item => item[getter];
  }
  return (a, b) => {
    if (getter(a) < getter(b)) {
      return -1;
    } else if (getter(a) > getter(b)) {
      return 1;
    }
    return 0;
  };
};

export default sortByKey;

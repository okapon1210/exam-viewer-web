const isTrue = /^(1|true)$/;

export const parseBool = (str: string) => {
  return isTrue.test(str.toLowerCase());
}

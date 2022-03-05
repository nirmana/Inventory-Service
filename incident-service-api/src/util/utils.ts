const bcrypt = require("bcrypt");
const saltRounds = 10;

export const validateString = (value: string) => {
  return value && value.trim().length > 0;
};
export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, saltRounds);
};
export const compareHash = (hash: string, plainText: string): boolean => {
  return bcrypt.compareSync(plainText, hash);
};
export const addDaysToDate = (date: Date, days: number): Date => {
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
};

export const getDate = (): Date => {
  return new Date();
};

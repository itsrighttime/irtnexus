import {
  regexLettersAndNumbers,
  regexLettersAndSpaces,
  regexLettersNumbersAndSpaces,
  regexLettersNumbersSpacesAndSpecialChars,
  regexOnlyLetters,
  regexOnlyNumbers,
} from "./generic.js";
import { regexFullname } from "./name.regex.js";

export const regEx = {
  fullname: regexFullname,
  letters: regexOnlyLetters,
  numbers: regexOnlyNumbers,
  lettersNumbers: regexLettersAndNumbers,
  lettersAndSpaces: regexLettersAndSpaces,
  lettersNumbersAndSpaces: regexLettersNumbersAndSpaces,
  lettersNumbersSpacesAndSpecialChars: regexLettersNumbersSpacesAndSpecialChars,
};

import { SavedNameData } from "@/lib/types";

export const isSameName = (name1: SavedNameData, name2: SavedNameData) => {
  return (
    name1.firstName === name2.firstName &&
    name1.lastName === name2.lastName &&
    name1.gender === name2.gender
  );
};

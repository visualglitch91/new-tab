import { atom, useAtom } from "jotai";
import { PaletteColors } from "$app/theme/palette";

export const pageColorAtom = atom<PaletteColors>("red");

export function usePageColor() {
  return useAtom(pageColorAtom);
}

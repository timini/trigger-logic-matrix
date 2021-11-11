import { Howl } from "howler";
import closedHatPath from "../public/sounds/808-HiHats05.mp3";
import kickPath from "../public/sounds/808-Kicks05.mp3";
import maracasPath from "../public/sounds/808-Maracas1.mp3";
import openHatPath from "../public/sounds/808-OpenHiHats08.mp3";
import rimPath from "../public/sounds/808-Rim4.mp3";
import stickPath from "../public/sounds/808-Stick2.mp3";

export const usePrecussion = () => {
  const closedHat = new Howl({
    src: [closedHatPath],
  });
  const maracas = new Howl({
    src: [maracasPath],
  });
  const openHat = new Howl({
    src: [openHatPath],
  });
  const stick = new Howl({
    src: [stickPath],
  });
  const kick = new Howl({
    src: [kickPath],
  });
  const rim = new Howl({
    src: [rimPath],
  });
  return {
    closedHat,
    maracas,
    openHat,
    stick,
    kick,
    rim,
  };
};

export default usePrecussion;

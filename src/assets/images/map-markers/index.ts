import type { ImageRequireSource, ImageResizeMode } from "react-native";

//@ts-expect-error undeclared module
import RedCar from "../3d-car-top-view-red.png";
//@ts-expect-error undeclared module
import WhiteCar from "../3d-car-top-view-white.png";
//@ts-expect-error undeclared module
import BlueTruck from "../3d-truck-top-view-blue.png";
//@ts-expect-error undeclared module
import Forklift from "../forklift.png";
//@ts-expect-error undeclared module
import BikeRider from "../bike-rider.png";
//@ts-expect-error undeclared module
import MarkerPin from "../marker-pin.png";
//@ts-expect-error undeclared module
import RacingFlag from "../racing-flag.png";

interface IMapMarker {
  name: string;
  size: {
    width: number;
    height: number;
  };
  icon: ImageRequireSource;
  offset: { x: number; y: number };
  rotate: number;
  anchor: { x: number; y: number };
  imageResizeMethod: "auto" | "scale" | "resize" | undefined;
  imageResizeMode: ImageResizeMode;
}

export const mapMarkers: Record<string, IMapMarker> = {
  "red-car-top": {
    name: "red-car-top",
    icon: RedCar,
    size: {
      width: 35,
      height: 35,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "white-car-top": {
    name: "white-car-top",
    icon: WhiteCar,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "blue-truck-top": {
    name: "blue-truck-top",
    icon: BlueTruck,
    size: {
      width: 56,
      height: 56,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "forklift-side-left": {
    name: "forklift-side-left",
    icon: Forklift,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "biker-rider-top": {
    name: "biker-rider-top",
    icon: BikeRider,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "marker-pin": {
    name: "marker-pin",
    icon: MarkerPin,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "racing-flag": {
    name: "racing-flag",
    icon: RacingFlag,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 18, y: -18 },
    anchor: { x: 0.5, y: 1.0 },
    rotate: -70,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
};

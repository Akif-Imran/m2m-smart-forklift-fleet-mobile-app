export enum ACTION_TYPES {
  SET_JOURNEY = 1,
  SET_DAY_TRIPS,
  TRACK_VIEW_CHANGES_START,
  UNTRACK_VIEW_CHANGES_START,
  TRACK_VIEW_CHANGES_END,
  UNTRACK_VIEW_CHANGES_END,
  SET_TRIP_DETAILS,
}

export type Actions =
  | {
      type: ACTION_TYPES.SET_JOURNEY;
      payload: { journeyId: number };
    }
  | { type: ACTION_TYPES.SET_DAY_TRIPS; payload: { dayTrips: IDayTrip[] } }
  | { type: ACTION_TYPES.TRACK_VIEW_CHANGES_START }
  | { type: ACTION_TYPES.UNTRACK_VIEW_CHANGES_START }
  | { type: ACTION_TYPES.TRACK_VIEW_CHANGES_END }
  | { type: ACTION_TYPES.UNTRACK_VIEW_CHANGES_END }
  | {
      type: ACTION_TYPES.SET_TRIP_DETAILS;
      payload: { tripDetails: ITripDetail[] };
    };

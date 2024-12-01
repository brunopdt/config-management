import Place from "./Place";

export default class Event {
    id?: number;

    name?: string;

    date?: string;

    duration?: string;

    fullDay?: boolean;

    placeId?: number;

    Place?: Place;

    favourite?: boolean;
}
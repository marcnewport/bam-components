type PlaceEventType = 'place:searched'

type PlaceEventDetail = {
  place: google.maps.places.Place
}

export class PlaceEvent extends CustomEvent<PlaceEventDetail> {
  public constructor(type: PlaceEventType, detail: PlaceEventDetail) {
    super(type, {
      detail,
      bubbles: true,
      cancelable: true,
    })
  }
}

declare global {
  interface HTMLElementEventMap {
    'place:searched': PlaceEvent
  }
}

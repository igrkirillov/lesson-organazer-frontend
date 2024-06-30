import ManualLocationDialogWidget from "./ManualLocationDialogWidget";
import Location from "./Location";

export default class LocationDeterminerWidget {
  constructor(mainElement) {
    this.mainElement = mainElement;
  }

  async determineMyLocation() {
    try {
      return await this.determineWithNavigator();
    } catch (e) {
      console.log("Error with navigator " + e);
      return this.determineManually();
    }
  }

  determineWithNavigator() {
    return new Promise((resolve, reject) => {
      const wrapResolveWithLocationDto = (geo) => {
        resolve(new Location(geo.coords.latitude, geo.coords.longitude));
      };
      navigator.geolocation.getCurrentPosition(
        wrapResolveWithLocationDto,
        reject
      );
    });
  }

  determineManually() {
    const widget = this;
    return new Promise((resolve, reject) => {
      new ManualLocationDialogWidget(widget.mainElement, resolve, reject);
    });
  }
}

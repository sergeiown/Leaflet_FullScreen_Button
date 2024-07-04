# [Leaflet FullScreen Button](https://sergeiown.github.io/Leaflet_FullScreen_Button/)

A Leaflet plugin for creating a button control with the functionality to activate full-screen mode. Simple and straightforward. Does not contain anything superfluous except for convenient and necessary options.

The idea came from a small project: [Map_with_Marker_Clusters](https://github.com/sergeiown/Map_with_Marker_Clusters) during the work on which there was a need to implement a full-screen mode but there was no desire to use existing plugins.

## Usage

- Install **[Leaflet](https://leafletjs.com/download.html)**

- Add `leaflet.fullscreen.js` to the page
```
<script src="./leaflet.fullscreen.js"></script>
```

- Initialize the map
```
const map = L.map('map').setView([49.1, 31.2], 5);
```

- Add a layer
```
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                minZoom: 4,
                maxZoom: 19,
            }).addTo(map);
```

- Add a new control for full-screen mode with options
```
L.control.fullScreenButton({ position: 'topright' }).addTo(map);
```

## API

It simply extends the `L.Control.FullScreenButton` class with a few options:

Option                 | Type     | Default                   | Description
-----------------------|----------|---------------------------|------------------------------------------------------
`position`              | `String`   | `'topleft'`                | Position of the button on the map.
`title`                  | `String`   | `'Toggle fullscreen mode'`  | The text of the button tooltip.
`enterFullScreenIcon`    | `String`   | `'./markers/full_screen.png'` | Icon to enter full-screen mode.
`exitFullScreenIcon`     | `String`   | `'./markers/general_screen.png'` | Icon to exit full-screen mode.
`enterFullScreenTitle`   | `String`   | `'Enter fullscreen mode'`   | Prompt text for entering full-screen mode.
`exitFullScreenTitle`    | `String`   | `'Exit fullscreen mode'`    | The text of the prompt to exit full-screen mode.
`onFullScreenChange`     | `Function` | `null`                      | Callback function with a callback when changing the full-screen mode.

and the method:

| Method                         | Returns            | Description                                                                                                                                               |
|-------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `toggleFullScreen(map: L.Map)`| `Promise<void>`       | Switches the full screen mode state for the `map`. Uses different methods for requesting full screen mode depending on the browser.             |                            |

## Note

The `pseudo-fullscreen` class **\*** is used as an alternative method for simulating fullscreen mode in cases where direct API methods for fullscreen mode are not supported by the browser. A prime example is the Safari browser on iOS when used on an iPhone.

*\* - styles are added dynamically using JS which allows to avoid an extra CSS file*

## MIT License

[Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Leaflet_FullScreen_Button/blob/main/LICENSE)

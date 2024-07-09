# [Leaflet FullScreen Button](https://sergeiown.github.io/Leaflet_FullScreen_Button/)

A Leaflet plugin for creating a button control with the functionality to activate full-screen mode. Simple and straightforward. Does not contain anything superfluous except for convenient and necessary options.

The idea came from a small project: **[Map_with_Marker_Clusters](https://github.com/sergeiown/Map_with_Marker_Clusters)** during the work on which there was a need to implement a full-screen mode but there was no desire to use existing plugins.

## Usage

- Install **[Leaflet](https://leafletjs.com/download.html)** - an open-source JavaScript library for mobile-friendly interactive maps

- Add **[leaflet.fullscreen.js](https://github.com/sergeiown/Leaflet_FullScreen_Button/tags)** to the page
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

- Add a new control for full screen mode with options of your choice
```
L.control.fullScreenButton({ position: 'topleft' }).addTo(map);
```
or
```
L.control
    .fullScreenButton({
        position: 'topleft',
        title: 'Toggle fullscreen mode',
        enterFullScreenIcon: './full_screen.png',
        exitFullScreenIcon: './general_screen.png',
        enterFullScreenTitle: 'Enter fullscreen mode',
        exitFullScreenTitle: 'Exit fullscreen mode',
        onFullScreenChange: (isFullScreen) => {
            console.log(`FullScreen mode is now ${isFullScreen ? 'ON' : 'OFF'}`);
        },
    })
    .addTo(map);
```

- You can call the toggleFullScreen method programmatically if necessary
```
const fullScreenControl = L.control.fullScreenButton();
fullScreenControl
    .toggleFullScreen(map)
    .then(() => {
        console.log('Full screen toggled');
    })
    .catch((err) => {
        console.error('Error toggling full screen:', err);
    });
```

## API

Option                    | Type       | Default                      | Description
--------------------------|------------|------------------------------|------------------------------------------------------
`position`                | `String`   | `'topleft'`                  | Position of the button on the map.
`title`                   | `String`   | `'Toggle fullscreen mode'`   | The text of the button tooltip.
`enterFullScreenIcon`     | `String`   | `null`                       | Image path for the button to enter full screen mode. Can be specified in formats: PNG, JPEG, SVG, or other formats supported by the web browser.
`exitFullScreenIcon`      | `String`   | `null`                       | Image path for the button to exit full screen mode. Can be specified in formats: PNG, JPEG, SVG, or other formats supported by the web browser.
`enterFullScreenTitle`    | `String`   | `'Enter fullscreen mode'`    | Prompt text for entering full-screen mode.
`exitFullScreenTitle`     | `String`   | `'Exit fullscreen mode'`     | The text of the prompt to exit full-screen mode.
`onFullScreenChange`      | `Function` | `null`                       | Callback function that is called when the fullscreen mode changes.

| Method                         | Returns            | Description                                                                                                                                               |
|-------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `toggleFullScreen(map: L.Map)`| `Promise<void>`       | Toggles the full screen mode state for the map. Uses different methods for requesting full screen mode depending on the browser.             |                            |

## Note

The `pseudo-fullscreen` class **\*** is used as an alternative method for simulating fullscreen mode in cases where direct API methods for fullscreen mode are not supported by the browser. A prime example is the Safari browser on iOS when used on an iPhone.

**\*** *- styles are added dynamically using JS which allows to avoid an extra CSS file*

## Example of use

**https://sergeiown.github.io/Leaflet_FullScreen_Button/**

## MIT License

**[Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Leaflet_FullScreen_Button/blob/main/LICENSE)**

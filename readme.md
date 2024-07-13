# [Leaflet FullScreen Button](https://sergeiown.github.io/Leaflet_FullScreen_Button/)

A Leaflet plugin for creating a button control with the functionality to activate full-screen mode. Simple and straightforward. Does not contain anything superfluous except for convenient and necessary options.

The idea came from a small project: **[Map_with_Marker_Clusters](https://github.com/sergeiown/Map_with_Marker_Clusters)** during the work on which there was a need to implement a full-screen mode but there was no desire to use existing plugins.

## Class Diagram

The following diagram outlines the structure and components of the `FullScreenButton` class:

```mermaid
graph LR;
    A[FullScreenButton Class] --> B[Options]
    A --> C[Methods]
    A --> D[Event Handlers]
    A --> E[Styling]

    B --> B1[position: 'topleft']
    B --> B2[title: 'Toggle fullscreen']
    B --> B3[enterFullScreenIcon: null]
    B --> B4[exitFullScreenIcon: null]
    B --> B5[enterFullScreenTitle: 'Enter fullscreen mode']
    B --> B6[exitFullScreenTitle: 'Exit fullscreen mode']
    B --> B7[onFullScreenChange: null]
    B --> B8[showNotification: true]

    C --> C1[public methods]
    C1 --> C2[onAdd]
    C1 --> C3[onRemove]
    C1 --> C4[toggleFullScreen]

    C --> C5[private methods]
    C5 --> C6[_toggleFullScreenElement]
    C5 --> C7[_handleFullScreenChange]
    C5 --> C8[_preventF11Default]
    C5 --> C9[_updateIcon]
    C5 --> C10[_addEventListeners]
    C5 --> C11[_removeEventListeners]
    C5 --> C12[_throttle]
    C5 --> C13[_isFullScreen]
    C5 --> C14[_showNotification]

    D --> D1[fullscreenchange]
    D --> D2[keydown]

    E --> E1[.pseudo-fullscreen]
    E --> E2[.leaflet-control-fullscreen]
    E --> E3[.leaflet-control-fullscreen:hover]
    E --> E4[#map-notification]
```

## API

| Option                    | Type       | Default                      | Description                                                                                  |
|---------------------------|------------|------------------------------|----------------------------------------------------------------------------------------------|
| `position`                | `String`   | `'topleft'`                  | Position of the button on the map.                                                           |
| `title`                   | `String`   | `'Toggle fullscreen mode'`   | The text of the button tooltip.                                                              |
| `enterFullScreenIcon`     | `String`   | `null`                       | Image path for the button to enter full screen mode. Can be specified in formats: PNG, JPEG, SVG, or other formats supported by the web browser. |
| `exitFullScreenIcon`      | `String`   | `null`                       | Image path for the button to exit full screen mode. Can be specified in formats: PNG, JPEG, SVG, or other formats supported by the web browser.  |
| `enterFullScreenTitle`    | `String`   | `'Enter fullscreen mode'`    | Prompt text for entering full-screen mode.                                                   |
| `exitFullScreenTitle`     | `String`   | `'Exit fullscreen mode'`     | The text of the prompt to exit full-screen mode.                                             |
| `showNotification`        | `Boolean`  | `true`                       | Indicates whether to display a notification when switching to full screen mode.              |
| `onFullScreenChange`      | `Function` | `null`                       | Callback function that is called when the fullscreen mode changes.                           |

| Method                        | Returns             | Description                                                                                                                                  |
|-------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `toggleFullScreen(map: L.Map)`| `Promise<void>`     | Toggles the full screen mode state for the map. Uses different methods for requesting full screen mode depending on the browser.             | 

## Note

- The pseudo-fullscreen mode is used as an alternative method for simulating fullscreen mode in cases where direct API methods for fullscreen mode are not supported by the browser. A prime example is the Safari browser on iOS when used on an iPhone
- Behavior when pressing the F11 key has been changed to use the `toggleFullScreen(map: L.Map)` method

## Browser Support

| Browser          | Version | Support Description                                                                 |
|------------------|---------|-------------------------------------------------------------------------------------|
| **Chrome**       | 50+     | Full support of the fullscreen API.                                                 |
| **Firefox**      | 47+     | Full support of the fullscreen API.                                                 |
| **Edge**         | 15+     | Full support of the fullscreen API.                                                 |
| **Safari**       | 11+     | Full support of the fullscreen API, except on iOS.                                  |
| **Opera**        | 37+     | Full support of the fullscreen API.                                                 |
| **IE**           | 11      | Limited support using msRequestFullscreen/msExitFullscreen methods.                 |
| **iOS Safari**   | 11+     | Pseudo-fullscreen mode through CSS classes, as the fullscreen API is not supported. |
| **Android Browser** | 50+  | Full support of the fullscreen API.                                                 |

## Usage

- **Install [Leaflet](https://leafletjs.com/download.html) - an open-source JavaScript library for mobile-friendly interactive maps**

- **Add [leaflet.fullscreen.js](https://github.com/sergeiown/Leaflet_FullScreen_Button/tags) to the page**
```
<script src="./leaflet.fullscreen.js"></script>
```

- **Initialize the map**
```
const map = L.map('map').setView([49.1, 31.2], 5);
```

- **Add a layer**
```
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    minZoom: 4,
    maxZoom: 19,
}).addTo(map);
```

- **Add a new control for full screen mode with options of your choice**
```
L.control.fullScreenButton({ position: 'topleft' }).addTo(map);
```
**or**
```
L.control
    .fullScreenButton({
        position: 'topleft',
        title: 'your text',
        enterFullScreenIcon: 'path/to/enter-icon.svg',
        exitFullScreenIcon: 'path/to/exit-icon.svg',
        enterFullScreenTitle: 'your text',
        exitFullScreenTitle: 'your text',
        showNotification: true,
        onFullScreenChange: () => {
            'your function';
        },
    })
    .addTo(map);
```

- **You can call the toggleFullScreen method programmatically if necessary**
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

## Example of use

**https://sergeiown.github.io/Leaflet_FullScreen_Button/**

## MIT License

**[Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Leaflet_FullScreen_Button/blob/main/LICENSE)**

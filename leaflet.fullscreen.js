/* Copyright (c) 2024 Serhii I. Myshko https://github.com/sergeiown/Leaflet_FullScreen_Button/blob/main/LICENSE */

L.Control.FullScreenButton = L.Control.extend({
    options: {
        position: 'topleft',
        title: 'Toggle fullscreen',
        enterFullScreenIcon: './markers/full_screen.png',
        exitFullScreenIcon: './markers/general_screen.png',
        enterFullScreenTitle: 'Enter fullscreen mode',
        exitFullScreenTitle: 'Exit fullscreen mode',
        onFullScreenChange: null,
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');
        container.title = this.options.title;

        this._updateIcon(container, false);

        container.onclick = () => {
            this.toggleFullScreen(map);
        };

        document.addEventListener('fullscreenchange', () => this._handleFullScreenChange(container));
        document.addEventListener('mozfullscreenchange', () => this._handleFullScreenChange(container));
        document.addEventListener('webkitfullscreenchange', () => this._handleFullScreenChange(container));
        document.addEventListener('MSFullscreenChange', () => this._handleFullScreenChange(container));
        document.addEventListener('keydown', this._preventF11Default.bind(this));

        return container;
    },

    toggleFullScreen: async function (map) {
        const mapContainer = map.getContainer();
        const isFullScreen =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement ||
            mapContainer.classList.contains('pseudo-fullscreen');

        if (!isFullScreen) {
            try {
                if (mapContainer.requestFullscreen) {
                    await mapContainer.requestFullscreen();
                } else if (mapContainer.mozRequestFullScreen) {
                    await mapContainer.mozRequestFullScreen();
                } else if (mapContainer.webkitRequestFullscreen) {
                    await mapContainer.webkitRequestFullscreen();
                } else if (mapContainer.msRequestFullscreen) {
                    await mapContainer.msRequestFullscreen();
                } else {
                    mapContainer.classList.add('pseudo-fullscreen');
                    this._updateIcon(this._container, true);
                    this._handleFullScreenChange(mapContainer);
                }
            } catch (err) {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            }
        } else {
            try {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    await document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                } else {
                    mapContainer.classList.remove('pseudo-fullscreen');
                    this._updateIcon(this._container, false);
                    this._handleFullScreenChange(mapContainer);
                }
            } catch (err) {
                console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
            }
        }
    },

    _handleFullScreenChange: function (container) {
        const isFullScreen =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;

        this._updateIcon(container, isFullScreen);
        container.title = isFullScreen ? this.options.exitFullScreenTitle : this.options.enterFullScreenTitle;

        if (typeof this.options.onFullScreenChange === 'function') {
            this.options.onFullScreenChange(isFullScreen);
        }
    },

    _preventF11Default: function (event) {
        if (event.key === 'F11') {
            event.preventDefault();
        }
    },

    _updateIcon: function (container, isFullScreen) {
        const iconUrl = isFullScreen ? this.options.exitFullScreenIcon : this.options.enterFullScreenIcon;
        container.style.backgroundImage = `url(${iconUrl})`;
    },
});

L.control.fullScreenButton = function (options) {
    return new L.Control.FullScreenButton(options);
};

const style = document.createElement('style');
style.innerHTML = `
    .pseudo-fullscreen {
        background-color: #ffffff;
        top: 0;
        left: 0;    
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 9999 !important;
    }

    .leaflet-control-fullscreen {
        background-color: #ffffff;
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 9999 !important;
    }
`;
document.head.appendChild(style);

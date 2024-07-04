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

        this._eventHandlers = {
            fullscreenchange: () => this._handleFullScreenChange(container),
            keydown: this._preventF11Default.bind(this),
        };

        document.addEventListener('fullscreenchange', this._eventHandlers.fullscreenchange);
        document.addEventListener('mozfullscreenchange', this._eventHandlers.fullscreenchange);
        document.addEventListener('webkitfullscreenchange', this._eventHandlers.fullscreenchange);
        document.addEventListener('MSFullscreenChange', this._eventHandlers.fullscreenchange);
        document.addEventListener('keydown', this._eventHandlers.keydown);

        return container;
    },

    onRemove: function () {
        this._removeEventListeners();
    },

    toggleFullScreen: async function (map) {
        const mapContainer = map.getContainer();
        const isFullScreen =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement ||
            mapContainer.classList.contains('pseudo-fullscreen');

        try {
            await this._toggleFullScreenElement(mapContainer, !isFullScreen);
            this._updateIcon(this._container, !isFullScreen);
            this._handleFullScreenChange(mapContainer);
        } catch (err) {
            console.error(`Error attempting to change full-screen mode: ${err.message} (${err.name})`);
        }
    },

    _toggleFullScreenElement: async function (element, enterFullScreen = true) {
        const fullScreenFunctions = [
            { enter: 'requestFullscreen', exit: 'exitFullscreen' },
            { enter: 'mozRequestFullScreen', exit: 'mozCancelFullScreen' },
            { enter: 'webkitRequestFullscreen', exit: 'webkitExitFullscreen' },
            { enter: 'msRequestFullscreen', exit: 'msExitFullscreen' },
        ];

        for (const fn of fullScreenFunctions) {
            if (enterFullScreen && element[fn.enter]) {
                await element[fn.enter]();
                return;
            } else if (!enterFullScreen && document[fn.exit]) {
                await document[fn.exit]();
                return;
            }
        }

        if (enterFullScreen) {
            element.classList.add('pseudo-fullscreen');
        } else {
            element.classList.remove('pseudo-fullscreen');
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
            if (this._isHandlingFullScreenChange) return;
            this._isHandlingFullScreenChange = true;

            this.options.onFullScreenChange(isFullScreen);

            setTimeout(() => {
                this._isHandlingFullScreenChange = false;
            }, 0);
        }
    },

    _preventF11Default: function (event) {
        if (event.key === 'F11') {
            event.preventDefault();
        }
    },

    _updateIcon: function (container, isFullScreen) {
        const iconUrl = isFullScreen ? this.options.exitFullScreenIcon : this.options.enterFullScreenIcon;
        if (container.classList.contains('leaflet-control-fullscreen')) {
            container.style.backgroundImage = `url('${iconUrl}')`;
        }
    },

    _removeEventListeners: function () {
        if (this._eventHandlers) {
            document.removeEventListener('fullscreenchange', this._eventHandlers.fullscreenchange);
            document.removeEventListener('mozfullscreenchange', this._eventHandlers.fullscreenchange);
            document.removeEventListener('webkitfullscreenchange', this._eventHandlers.fullscreenchange);
            document.removeEventListener('MSFullscreenChange', this._eventHandlers.fullscreenchange);
            document.removeEventListener('keydown', this._eventHandlers.keydown);
            delete this._eventHandlers;
        }
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

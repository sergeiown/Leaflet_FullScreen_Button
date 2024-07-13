/* Copyright (c) 2024 Serhii I. Myshko https://github.com/sergeiown/Leaflet_FullScreen_Button/blob/main/LICENSE */

L.Control.FullScreenButton = L.Control.extend({
    options: {
        position: 'topleft',
        title: 'Toggle fullscreen',
        enterFullScreenIcon: null,
        exitFullScreenIcon: null,
        enterFullScreenTitle: 'Enter fullscreen mode',
        exitFullScreenTitle: 'Exit fullscreen mode',
        onFullScreenChange: null,
        showNotification: true,
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');
        container.title = this.options.title;

        this._updateIcon(container, false);

        container.onclick = () => {
            this.toggleFullScreen(map);
        };

        this._eventHandlers = {
            fullscreenchange: this._throttle(() => this._handleFullScreenChange(container, map), 100),
            keydown: this._preventF11Default.bind(this),
        };

        this._addEventListeners();

        return container;
    },

    onRemove: function () {
        this._removeEventListeners();
    },

    toggleFullScreen: async function (map) {
        const mapContainer = map.getContainer();
        const isFullScreen = this._isFullScreen(mapContainer);

        try {
            await this._toggleFullScreenElement(mapContainer, !isFullScreen);
            this._updateIcon(this._container, !isFullScreen);
            this._handleFullScreenChange(mapContainer, map);
        } catch (err) {
            console.error(`Error switching to full-screen mode: ${err.message} (${err.name})`);
            if (this.options.showNotification) {
                this._showNotification(`Error switching to full-screen mode`, mapContainer);
            }
        }
    },

    _toggleFullScreenElement: async function (element, enterFullScreen = true) {
        const methods = {
            enter: ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'],
            exit: ['exitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen', 'msExitFullscreen'],
        };

        const target = enterFullScreen ? element : document;

        for (const method of methods[enterFullScreen ? 'enter' : 'exit']) {
            if (target[method]) {
                await target[method]();
                return;
            }
        }

        element.classList.toggle('pseudo-fullscreen', enterFullScreen);

        map.invalidateSize();
    },

    _handleFullScreenChange: function (container, map) {
        const isFullScreen = this._isFullScreen(container);
        this._updateIcon(container, isFullScreen);
        this._container.title = isFullScreen ? this.options.exitFullScreenTitle : this.options.enterFullScreenTitle;

        if (typeof this.options.onFullScreenChange === 'function') {
            if (this._isHandlingFullScreenChange) return;
            this._isHandlingFullScreenChange = true;

            requestAnimationFrame(() => {
                this.options.onFullScreenChange(isFullScreen);
                this._isHandlingFullScreenChange = false;
            });
        }

        if (this.options.showNotification) {
            this._showNotification(
                isFullScreen ? 'Full-screen mode is ON' : 'Full-screen mode is OFF',
                map.getContainer()
            );
        }
    },

    _preventF11Default: function (event) {
        if (event.key === 'F11') {
            event.preventDefault();
            this.toggleFullScreen(map);
        }
    },

    _updateIcon: function (container, isFullScreen) {
        const enterFullScreenIconDefault = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 6C5 5.44772 5.44772 5 6 5H8C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3H6C4.34315 3 3 4.34315 3 6V8C3 8.55228 3.44772 9 4 9C4.55228 9 5 8.55228 5 8V6Z" fill="black"/>
                <path d="M5 18C5 18.5523 5.44772 19 6 19H8C8.55228 19 9 19.4477 9 20C9 20.5523 8.55228 21 8 21H6C4.34315 21 3 19.6569 3 18V16C3 15.4477 3.44772 15 4 15C4.55228 15 5 15.4477 5 16V18Z" fill="black"/>
                <path d="M18 5C18.5523 5 19 5.44772 19 6V8C19 8.55228 19.4477 9 20 9C20.5523 9 21 8.55228 21 8V6C21 4.34315 19.6569 3 18 3H16C15.4477 3 15 3.44772 15 4C15 4.55228 15.4477 5 16 5H18Z" fill="black"/>
                <path d="M19 18C19 18.5523 18.5523 19 18 19H16C15.4477 19 15 19.4477 15 20C15 20.5523 15.4477 21 16 21H18C19.6569 21 21 19.6569 21 18V16C21 15.4477 20.5523 15 20 15C19.4477 15 19 15.4477 19 16V18Z" fill="black"/>
            </svg>
        `;

        const exitFullScreenIconDefault = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 4C9 3.44772 8.55228 3 8 3C7.44772 3 7 3.44772 7 4V6.5C7 6.77614 6.77614 7 6.5 7H4C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9H6.5C7.88071 9 9 7.88071 9 6.5V4Z" fill="black"/>
                <path d="M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20V17.5C7 17.2239 6.77614 17 6.5 17H4C3.44772 17 3 16.5523 3 16C3 15.4477 3.44772 15 4 15H6.5C7.88071 15 9 16.1193 9 17.5V20Z" fill="black"/>
                <path d="M16 3C15.4477 3 15 3.44772 15 4V6.5C15 7.88071 16.1193 9 17.5 9H20C20.5523 9 21 8.55228 21 8C21 7.44772 20.5523 7 20 7H17.5C17.2239 7 17 6.77614 17 6.5V4C17 3.44772 16.5523 3 16 3Z" fill="black"/>
                <path d="M15 20C15 20.5523 15.4477 21 16 21C16.5523 21 17 20.5523 17 20V17.5C17 17.2239 17.2239 17 17.5 17H20C20.5523 17 21 16.5523 21 16C21 15.4477 20.5523 15 20 15H17.5C16.1193 15 15 16.1193 15 17.5V20Z" fill="black"/>
            </svg>
        `;

        const iconUrl = isFullScreen
            ? this.options.exitFullScreenIcon || `data:image/svg+xml;base64,${btoa(exitFullScreenIconDefault)}`
            : this.options.enterFullScreenIcon || `data:image/svg+xml;base64,${btoa(enterFullScreenIconDefault)}`;

        if (container.classList.contains('leaflet-control-fullscreen')) {
            container.style.backgroundImage = `url('${iconUrl}')`;
        }
    },

    _addEventListeners: function () {
        document.addEventListener('fullscreenchange', this._eventHandlers.fullscreenchange);
        document.addEventListener('mozfullscreenchange', this._eventHandlers.fullscreenchange);
        document.addEventListener('webkitfullscreenchange', this._eventHandlers.fullscreenchange);
        document.addEventListener('MSFullscreenChange', this._eventHandlers.fullscreenchange);
        document.addEventListener('keydown', this._eventHandlers.keydown);
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

    _throttle: function (func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    _isFullScreen: function (element) {
        return (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement ||
            element.classList.contains('pseudo-fullscreen')
        );
    },

    _showNotification: function (message, mapContainer) {
        if (this._notificationElement) {
            mapContainer.removeChild(this._notificationElement);
            this._notificationElement = null;
            clearTimeout(this._notificationTimeout);
        }

        const notification = L.DomUtil.create('div', '', mapContainer);
        notification.id = 'map-notification';
        notification.innerText = message;
        mapContainer.appendChild(notification);

        this._notificationElement = notification;

        this._notificationTimeout = setTimeout(() => {
            notification.style.transition = 'opacity 1s';
            notification.style.opacity = '0';

            setTimeout(() => {
                if (notification.parentElement) {
                    mapContainer.removeChild(notification);
                }
                this._notificationElement = null;
            }, 1000);
        }, 3000);
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
        z-index: 9999;
    }

    #map-notification {
        position: absolute;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        padding: 10px 20px;
        background-color: #00000099;
        color: #ffffff;
        font-size: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 5px;
        z-index: 9999;
    }
`;
document.head.appendChild(style);

(() => {
    "use strict";
    const flsModules = {};
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function showMore() {
        const showMoreBlocks = document.querySelectorAll("[data-showmore]");
        let showMoreBlocksRegular;
        let mdQueriesArray;
        if (showMoreBlocks.length) {
            showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function(item, index, self) {
                return !item.dataset.showmoreMedia;
            }));
            showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
            document.addEventListener("click", showMoreActions);
            window.addEventListener("resize", showMoreActions);
            mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
            if (mdQueriesArray && mdQueriesArray.length) {
                mdQueriesArray.forEach((mdQueriesItem => {
                    mdQueriesItem.matchMedia.addEventListener("change", (function() {
                        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                    }));
                }));
                initItemsMedia(mdQueriesArray);
            }
        }
        function initItemsMedia(mdQueriesArray) {
            mdQueriesArray.forEach((mdQueriesItem => {
                initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function initItems(showMoreBlocks, matchMedia) {
            showMoreBlocks.forEach((showMoreBlock => {
                initItem(showMoreBlock, matchMedia);
            }));
        }
        function initItem(showMoreBlock, matchMedia = false) {
            showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
            let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
            let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
            showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
            showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
            const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
            if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                _slideUp(showMoreContent, 0, hiddenHeight);
                showMoreButton.hidden = false;
            } else {
                _slideDown(showMoreContent, 0, hiddenHeight);
                showMoreButton.hidden = true;
            } else {
                _slideDown(showMoreContent, 0, hiddenHeight);
                showMoreButton.hidden = true;
            }
        }
        function getHeight(showMoreBlock, showMoreContent) {
            let hiddenHeight = 0;
            const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
            if ("items" === showMoreType) {
                const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
                const showMoreItems = showMoreContent.children;
                for (let index = 1; index < showMoreItems.length; index++) {
                    const showMoreItem = showMoreItems[index - 1];
                    hiddenHeight += showMoreItem.offsetHeight;
                    if (index == showMoreTypeValue) break;
                }
            } else {
                const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
                hiddenHeight = showMoreTypeValue;
            }
            return hiddenHeight;
        }
        function getOriginalHeight(showMoreContent) {
            let parentHidden;
            let hiddenHeight = showMoreContent.offsetHeight;
            showMoreContent.style.removeProperty("height");
            if (showMoreContent.closest(`[hidden]`)) {
                parentHidden = showMoreContent.closest(`[hidden]`);
                parentHidden.hidden = false;
            }
            let originalHeight = showMoreContent.offsetHeight;
            parentHidden ? parentHidden.hidden = true : null;
            showMoreContent.style.height = `${hiddenHeight}px`;
            return originalHeight;
        }
        function showMoreActions(e) {
            const targetEvent = e.target;
            const targetType = e.type;
            if ("click" === targetType) {
                if (targetEvent.closest("[data-showmore-button]")) {
                    const showMoreButton = targetEvent.closest("[data-showmore-button]");
                    const showMoreBlock = showMoreButton.closest("[data-showmore]");
                    const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                    const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
                    const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                    if (!showMoreContent.classList.contains("_slide")) {
                        showMoreBlock.classList.contains("_showmore-active") ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                        showMoreBlock.classList.toggle("_showmore-active");
                    }
                }
            } else if ("resize" === targetType) {
                showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
            }
        }
    }
    function FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? FLS(`[Попапос]: ${message}`) : null;
        }
    }
    flsModules.popup = new Popup({});
    let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function formSubmit() {
        const forms = document.forms;
        if (forms.length) for (const form of forms) {
            form.addEventListener("submit", (function(e) {
                const form = e.target;
                formSubmitAction(form, e);
            }));
            form.addEventListener("reset", (function(e) {
                const form = e.target;
                formValidate.formClean(form);
            }));
        }
        async function formSubmitAction(form, e) {
            const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
            if (0 === error) {
                const ajax = form.hasAttribute("data-ajax");
                if (ajax) {
                    e.preventDefault();
                    form.getAttribute("action") && form.getAttribute("action").trim();
                    const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
                    const formData = new FormData(form);
                    form.classList.add("_sending");
                    const response = await fetch("formAction", {
                        method: formMethod,
                        body: formData
                    });
                    if (response.ok) {
                        let responseResult = await response.json();
                        form.classList.remove("_sending");
                        formSent(form, responseResult);
                    } else {
                        alert("Помилка");
                        form.classList.remove("_sending");
                    }
                } else if (form.hasAttribute("data-dev")) {
                    e.preventDefault();
                    formSent(form);
                }
            } else {
                e.preventDefault();
                if (form.querySelector("._form-error") && form.hasAttribute("data-goto-error")) {
                    const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : "._form-error";
                    gotoBlock(formGoToErrorClass, true, 1e3);
                }
            }
        }
        function formSent(form, responseResult = ``) {
            document.dispatchEvent(new CustomEvent("formSent", {
                detail: {
                    form
                }
            }));
            setTimeout((() => {
                if (flsModules.popup) {
                    const popup = form.dataset.popupMessage;
                    popup ? flsModules.popup.open(popup) : null;
                }
            }), 0);
            formValidate.formClean(form);
            formLogging(`Форму відправлено!`);
        }
        function formLogging(message) {
            FLS(`[Форми]: ${message}`);
        }
    }
    function ssr_window_esm_isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay = 0) {
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis = "x") {
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend(...args) {
        const to = Object(args[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < args.length; i += 1) {
            const nextSource = args[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll({swiper, targetPosition, side}) {
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    function utils_elementChildren(element, selector = "") {
        return [ ...element.children ].filter((el => el.matches(selector)));
    }
    function utils_createElement(tag, classes = []) {
        const el = document.createElement(tag);
        el.classList.add(...Array.isArray(classes) ? classes : [ classes ]);
        return el;
    }
    function elementPrevAll(el, selector) {
        const prevEls = [];
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (prev.matches(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return prevEls;
    }
    function elementNextAll(el, selector) {
        const nextEls = [];
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (next.matches(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return nextEls;
    }
    function elementStyle(el, prop) {
        const window = ssr_window_esm_getWindow();
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }
    function utils_elementIndex(el) {
        let child = el;
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function utils_elementParents(el, selector) {
        const parents = [];
        let parent = el.parentElement;
        while (parent) {
            if (selector) {
                if (parent.matches(selector)) parents.push(parent);
            } else parents.push(parent);
            parent = parent.parentElement;
        }
        return parents;
    }
    function utils_elementOuterSize(el, size, includeMargins) {
        const window = ssr_window_esm_getWindow();
        if (includeMargins) return el["width" === size ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue("width" === size ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue("width" === size ? "margin-left" : "margin-bottom"));
        return el.offsetWidth;
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice({userAgent} = {}) {
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides = {}) {
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        let needPerspectiveFix = false;
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        if (isSafari()) {
            const ua = String(window.navigator.userAgent);
            if (ua.includes("Version/")) {
                const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num => Number(num)));
                needPerspectiveFix = major < 16 || 16 === major && minor < 2;
            }
        }
        return {
            isSafari: needPerspectiveFix || isSafari(),
            needPerspectiveFix,
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize({swiper, on, emit}) {
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((({contentBoxSize, contentRect, target}) => {
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer({swiper, extendParams, on, emit}) {
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = (target, options = {}) => {
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (swiper.__preventObserver__) return;
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = utils_elementParents(swiper.el);
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.el, {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.wrapperEl, {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler(...args) {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit(...args) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const el = swiper.el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = el.clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = el.clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
        height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {wrapperEl, slidesEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = utils_elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        slides.forEach((slideEl => {
            if (rtl) slideEl.style.marginLeft = ""; else slideEl.style.marginRight = "";
            slideEl.style.marginBottom = "";
            slideEl.style.marginTop = "";
        }));
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            let slide;
            if (slides[i]) slide = slides[i];
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if (slides[i] && "none" === elementStyle(slide, "display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide);
                const currentTransform = slide.style.transform;
                const currentWebKitTransform = slide.style.webkitTransform;
                if (currentTransform) slide.style.transform = "none";
                if (currentWebKitTransform) slide.style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? utils_elementOuterSize(slide, "width", true) : utils_elementOuterSize(slide, "height", true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide;
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide.style.transform = currentTransform;
                if (currentWebKitTransform) slide.style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) wrapperEl.style.width = `${swiper.virtualSize + params.spaceBetween}px`;
        if (params.setWrapperSize) wrapperEl.style[getDirectionLabel("width")] = `${swiper.virtualSize + params.spaceBetween}px`;
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (isVirtual && params.loop) {
            const size = slidesSizesGrid[0] + spaceBetween;
            if (params.slidesPerGroup > 1) {
                const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
                const groupSize = size * params.slidesPerGroup;
                for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
            }
            for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
                if (1 === params.slidesPerGroup) snapGrid.push(snapGrid[snapGrid.length - 1] + size);
                slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
                swiper.virtualSize += size;
            }
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode || params.loop) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).forEach((slideEl => {
                slideEl.style[key] = `${spaceBetween}px`;
            }));
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.el.classList.remove(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.getSlideIndexByData(index);
            return swiper.slides[index];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.wrapperEl.style.height = `${newHeight}px`;
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset;
    }
    function updateSlidesProgress(translate = this && this.translate || 0) {
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.forEach((slideEl => {
            slideEl.classList.remove(params.slideVisibleClass);
        }));
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides[i].classList.add(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd, progressLoop} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
            const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
            isBeginning = isBeginningRounded || progress <= 0;
            isEnd = isEndRounded || progress >= 1;
            if (isBeginningRounded) progress = 0;
            if (isEndRounded) progress = 1;
        }
        if (params.loop) {
            const firstSlideIndex = swiper.getSlideIndexByData(0);
            const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
            const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
            const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
            const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
            const translateAbs = Math.abs(translate);
            if (translateAbs >= firstSlideTranslate) progressLoop = (translateAbs - firstSlideTranslate) / translateMax; else progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
            if (progressLoop > 1) progressLoop -= 1;
        }
        Object.assign(swiper, {
            progress,
            progressLoop,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, slidesEl, activeIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const getFilteredSlide = selector => utils_elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
        slides.forEach((slideEl => {
            slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
        }));
        let activeSlide;
        if (isVirtual) if (params.loop) {
            let slideIndex = activeIndex - swiper.virtual.slidesBefore;
            if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
            if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
            activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
        } else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides[activeIndex];
        if (activeSlide) {
            activeSlide.classList.add(params.slideActiveClass);
            let nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
            if (params.loop && !nextSlide) nextSlide = slides[0];
            if (nextSlide) nextSlide.classList.add(params.slideNextClass);
            let prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
            if (params.loop && 0 === !prevSlide) prevSlide = slides[slides.length - 1];
            if (prevSlide) prevSlide.classList.add(params.slidePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function getActiveIndexByTranslate(swiper) {
        const {slidesGrid, params} = swiper;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        let activeIndex;
        for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
            if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
        } else if (translate >= slidesGrid[i]) activeIndex = i;
        if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        return activeIndex;
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        const getVirtualRealIndex = aIndex => {
            let realIndex = aIndex - swiper.virtual.slidesBefore;
            if (realIndex < 0) realIndex = swiper.virtual.slides.length + realIndex;
            if (realIndex >= swiper.virtual.slides.length) realIndex -= swiper.virtual.slides.length;
            return realIndex;
        };
        if ("undefined" === typeof activeIndex) activeIndex = getActiveIndexByTranslate(swiper);
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) swiper.realIndex = getVirtualRealIndex(activeIndex);
            return;
        }
        let realIndex;
        if (swiper.virtual && params.virtual.enabled && params.loop) realIndex = getVirtualRealIndex(activeIndex); else if (swiper.slides[activeIndex]) realIndex = parseInt(swiper.slides[activeIndex].getAttribute("data-swiper-slide-index") || activeIndex, 10); else realIndex = activeIndex;
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = e.closest(`.${params.slideClass}, swiper-slide`);
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis = (this.isHorizontal() ? "x" : "y")) {
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate(wrapperEl, axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit({swiper, runCallbacks, direction, step}) {
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const transition = {
        setTransition,
        transitionStart,
        transitionEnd
    };
    function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
        if ("string" === typeof index) index = parseInt(index, 10);
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        const translate = -snapGrid[snapIndex];
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        swiper.updateProgress(translate);
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
                    swiper._cssModeVirtualInitialSet = true;
                    requestAnimationFrame((() => {
                        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                    }));
                } else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._immediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual.enabled) newIndex += swiper.virtual.slidesBefore; else newIndex = swiper.getSlideIndexByData(newIndex);
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {enabled, params, animating} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        if (params.loop) {
            if (animating && !isVirtual && params.loopPreventsSliding) return false;
            swiper.loopFix({
                direction: "next"
            });
            swiper._clientLeft = swiper.wrapperEl.clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {params, snapGrid, slidesGrid, rtlTranslate, enabled, animating} = swiper;
        if (!enabled) return swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        if (params.loop) {
            if (animating && !isVirtual && params.loopPreventsSliding) return false;
            swiper.loopFix({
                direction: "prev"
            });
            swiper._clientLeft = swiper.wrapperEl.clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = .5) {
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, slidesEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate(slideRealIndex) {
        const swiper = this;
        const {params, slidesEl} = swiper;
        if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
        const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
        slides.forEach(((el, index) => {
            el.setAttribute("data-swiper-slide-index", index);
        }));
        swiper.loopFix({
            slideRealIndex,
            direction: params.centeredSlides ? void 0 : "next"
        });
    }
    function loopFix({slideRealIndex, slideTo = true, direction, setTranslate, activeSlideIndex, byController, byMousewheel} = {}) {
        const swiper = this;
        if (!swiper.params.loop) return;
        swiper.emit("beforeLoopFix");
        const {slides, allowSlidePrev, allowSlideNext, slidesEl, params} = swiper;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        if (swiper.virtual && params.virtual.enabled) {
            if (slideTo) if (!params.centeredSlides && 0 === swiper.snapIndex) swiper.slideTo(swiper.virtual.slides.length, 0, false, true); else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true); else if (swiper.snapIndex === swiper.snapGrid.length - 1) swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
            swiper.allowSlidePrev = allowSlidePrev;
            swiper.allowSlideNext = allowSlideNext;
            swiper.emit("loopFix");
            return;
        }
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10));
        let loopedSlides = params.loopedSlides || slidesPerView;
        if (loopedSlides % params.slidesPerGroup !== 0) loopedSlides += params.slidesPerGroup - loopedSlides % params.slidesPerGroup;
        swiper.loopedSlides = loopedSlides;
        const prependSlidesIndexes = [];
        const appendSlidesIndexes = [];
        let activeIndex = swiper.activeIndex;
        if ("undefined" === typeof activeSlideIndex) activeSlideIndex = swiper.getSlideIndex(swiper.slides.filter((el => el.classList.contains(params.slideActiveClass)))[0]); else activeIndex = activeSlideIndex;
        const isNext = "next" === direction || !direction;
        const isPrev = "prev" === direction || !direction;
        let slidesPrepended = 0;
        let slidesAppended = 0;
        if (activeSlideIndex < loopedSlides) {
            slidesPrepended = Math.max(loopedSlides - activeSlideIndex, params.slidesPerGroup);
            for (let i = 0; i < loopedSlides - activeSlideIndex; i += 1) {
                const index = i - Math.floor(i / slides.length) * slides.length;
                prependSlidesIndexes.push(slides.length - index - 1);
            }
        } else if (activeSlideIndex > swiper.slides.length - 2 * loopedSlides) {
            slidesAppended = Math.max(activeSlideIndex - (swiper.slides.length - 2 * loopedSlides), params.slidesPerGroup);
            for (let i = 0; i < slidesAppended; i += 1) {
                const index = i - Math.floor(i / slides.length) * slides.length;
                appendSlidesIndexes.push(index);
            }
        }
        if (isPrev) prependSlidesIndexes.forEach((index => {
            slidesEl.prepend(swiper.slides[index]);
        }));
        if (isNext) appendSlidesIndexes.forEach((index => {
            slidesEl.append(swiper.slides[index]);
        }));
        swiper.recalcSlides();
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (slideTo) if (prependSlidesIndexes.length > 0 && isPrev) {
            if ("undefined" === typeof slideRealIndex) {
                const currentSlideTranslate = swiper.slidesGrid[activeIndex];
                const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
                const diff = newSlideTranslate - currentSlideTranslate;
                if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                    swiper.slideTo(activeIndex + slidesPrepended, 0, false, true);
                    if (setTranslate) swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] += diff;
                }
            } else if (setTranslate) swiper.slideToLoop(slideRealIndex, 0, false, true);
        } else if (appendSlidesIndexes.length > 0 && isNext) if ("undefined" === typeof slideRealIndex) {
            const currentSlideTranslate = swiper.slidesGrid[activeIndex];
            const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
            const diff = newSlideTranslate - currentSlideTranslate;
            if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
                swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
                if (setTranslate) swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] += diff;
            }
        } else swiper.slideToLoop(slideRealIndex, 0, false, true);
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.controller && swiper.controller.control && !byController) {
            const loopParams = {
                slideRealIndex,
                slideTo: false,
                direction,
                setTranslate,
                activeSlideIndex,
                byController: true
            };
            if (Array.isArray(swiper.controller.control)) swiper.controller.control.forEach((c => {
                if (!c.destroyed && c.params.loop) c.loopFix(loopParams);
            })); else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) swiper.controller.control.loopFix(loopParams);
        }
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {params, slidesEl} = swiper;
        if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
        swiper.recalcSlides();
        const newSlidesOrder = [];
        swiper.slides.forEach((slideEl => {
            const index = "undefined" === typeof slideEl.swiperSlideIndex ? 1 * slideEl.getAttribute("data-swiper-slide-index") : slideEl.swiperSlideIndex;
            newSlidesOrder[index] = slideEl;
        }));
        swiper.slides.forEach((slideEl => {
            slideEl.removeAttribute("data-swiper-slide-index");
        }));
        newSlidesOrder.forEach((slideEl => {
            slidesEl.append(slideEl);
        }));
        swiper.recalcSlides();
        swiper.slideTo(swiper.realIndex, 0);
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        if (swiper.isElement) swiper.__preventObserver__ = true;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
        if (swiper.isElement) requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        if (swiper.isElement) swiper.__preventObserver__ = true;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
        if (swiper.isElement) requestAnimationFrame((() => {
            swiper.__preventObserver__ = false;
        }));
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base = this) {
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        data.evCache.push(event);
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && "mouse" === event.pointerType) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let targetEl = e.target;
        if ("wrapper" === params.touchEventsTarget) if (!swiper.wrapperEl.contains(targetEl)) return;
        if ("which" in e && 3 === e.which) return;
        if ("button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        const eventPath = event.composedPath ? event.composedPath() : event.path;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) targetEl = eventPath[0];
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!targetEl.closest(params.swipeHandler)) return;
        touches.currentX = e.pageX;
        touches.currentY = e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        let preventDefault = true;
        if (targetEl.matches(data.focusableElements)) {
            preventDefault = false;
            if ("SELECT" === targetEl.nodeName) data.isTouched = false;
        }
        if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl) document.activeElement.blur();
        const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
        if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) e.preventDefault();
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && "mouse" === event.pointerType) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        const pointerIndex = data.evCache.findIndex((cachedEv => cachedEv.pointerId === e.pointerId));
        if (pointerIndex >= 0) data.evCache[pointerIndex] = e;
        const targetTouch = data.evCache.length > 1 ? data.evCache[0] : e;
        const pageX = targetTouch.pageX;
        const pageY = targetTouch.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!e.target.matches(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    prevX: swiper.touches.currentX,
                    prevY: swiper.touches.currentY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (document.activeElement) if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling || swiper.zoom && swiper.params.zoom && swiper.params.zoom.enabled && data.evCache.length > 1) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        let diff = swiper.isHorizontal() ? diffX : diffY;
        let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
        if (params.oneWayMovement) {
            diff = Math.abs(diff) * (rtl ? 1 : -1);
            touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
        }
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) {
            diff = -diff;
            touchesDiff = -touchesDiff;
        }
        const prevTouchesDirection = swiper.touchesDirection;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
        const isLoop = swiper.params.loop && !params.cssMode;
        if (!data.isMoved) {
            if (isLoop) swiper.loopFix({
                direction: swiper.swipeDirection
            });
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) {
                const evt = new window.CustomEvent("transitionend", {
                    bubbles: true,
                    cancelable: true
                });
                swiper.wrapperEl.dispatchEvent(evt);
            }
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        let loopFixed;
        if (data.isMoved && prevTouchesDirection !== swiper.touchesDirection && isLoop && Math.abs(diff) >= 1) {
            swiper.loopFix({
                direction: swiper.swipeDirection,
                setTranslate: true
            });
            loopFixed = true;
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0) {
            if (isLoop && !loopFixed && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.size / 2 : swiper.minTranslate())) swiper.loopFix({
                direction: "prev",
                setTranslate: true,
                activeSlideIndex: 0
            });
            if (data.currentTranslate > swiper.minTranslate()) {
                disableParentSwiper = false;
                if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
            }
        } else if (diff < 0) {
            if (isLoop && !loopFixed && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.size / 2 : swiper.maxTranslate())) swiper.loopFix({
                direction: "next",
                setTranslate: true,
                activeSlideIndex: swiper.slides.length - ("auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
            });
            if (data.currentTranslate < swiper.maxTranslate()) {
                disableParentSwiper = false;
                if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
            }
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const pointerIndex = data.evCache.findIndex((cachedEv => cachedEv.pointerId === event.pointerId));
        if (pointerIndex >= 0) data.evCache.splice(pointerIndex, 1);
        if ([ "pointercancel", "pointerout", "pointerleave" ].includes(event.type)) {
            const proceed = "pointercancel" === event.type && (swiper.browser.isSafari || swiper.browser.isWebView);
            if (!proceed) return;
        }
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && "mouse" === event.pointerType) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    let timeout;
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        const isVirtualLoop = isVirtual && params.loop;
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else if (swiper.params.loop && !isVirtual) swiper.slideToLoop(swiper.realIndex, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
            clearTimeout(timeout);
            timeout = setTimeout((() => {
                if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.resume();
            }), 500);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    const processLazyPreloader = (swiper, imageEl) => {
        if (!swiper || swiper.destroyed || !swiper.params) return;
        const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
        const slideEl = imageEl.closest(slideSelector());
        if (slideEl) {
            const lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            if (lazyEl) lazyEl.remove();
        }
    };
    function onLoad(e) {
        const swiper = this;
        processLazyPreloader(swiper, e.target);
        swiper.update();
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, el, wrapperEl, device} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        el[domMethod]("pointerdown", swiper.onTouchStart, {
            passive: false
        });
        document[domMethod]("pointermove", swiper.onTouchMove, {
            passive: false,
            capture
        });
        document[domMethod]("pointerup", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointercancel", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerout", swiper.onTouchEnd, {
            passive: true
        });
        document[domMethod]("pointerleave", swiper.onTouchEnd, {
            passive: true
        });
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
        el[domMethod]("load", swiper.onLoad, {
            capture: true
        });
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        swiper.onLoad = onLoad.bind(swiper);
        if (!dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {realIndex, initialized, params, el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            el.classList.add(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) el.classList.add(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate(realIndex);
            swiper.updateSlides();
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base = "window", containerEl) {
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, el, device} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        el.classList.add(...classNames);
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {el, classNames} = swiper;
        el.classList.remove(...classNames);
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        oneWayMovement: false,
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 5,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        loop: false,
        loopedSlides: null,
        loopPreventsSliding: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideActiveClass: "swiper-slide-active",
        slideVisibleClass: "swiper-slide-visible",
        slideNextClass: "swiper-slide-next",
        slidePrevClass: "swiper-slide-prev",
        wrapperClass: "swiper-wrapper",
        lazyPreloaderClass: "swiper-lazy-preloader",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj = {}) {
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor(...args) {
            let el;
            let params;
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            const document = ssr_window_esm_getDocument();
            if (params.el && "string" === typeof params.el && document.querySelectorAll(params.el).length > 1) {
                const swipers = [];
                document.querySelectorAll(params.el).forEach((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    params,
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: [],
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    startMoving: void 0,
                    evCache: []
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        getSlideIndex(slideEl) {
            const {slidesEl, params} = this;
            const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
            const firstSlideIndex = utils_elementIndex(slides[0]);
            return utils_elementIndex(slideEl) - firstSlideIndex;
        }
        getSlideIndexByData(index) {
            return this.getSlideIndex(this.slides.filter((slideEl => 1 * slideEl.getAttribute("data-swiper-slide-index") === index))[0]);
        }
        recalcSlides() {
            const swiper = this;
            const {slidesEl, params} = swiper;
            swiper.slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.forEach((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view = "current", exact = false) {
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            [ ...swiper.el.querySelectorAll('[loading="lazy"]') ].forEach((imageEl => {
                if (imageEl.complete) processLazyPreloader(swiper, imageEl);
            }));
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate = true) {
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
            swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.forEach((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(element) {
            const swiper = this;
            if (swiper.mounted) return true;
            let el = element || swiper.params.el;
            if ("string" === typeof el) el = document.querySelector(el);
            if (!el) return false;
            el.swiper = swiper;
            if (el.shadowEl) swiper.isElement = true;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = el.shadowRoot.querySelector(getWrapperSelector());
                    return res;
                }
                return utils_elementChildren(el, getWrapperSelector())[0];
            };
            let wrapperEl = getWrapper();
            if (!wrapperEl && swiper.params.createElements) {
                wrapperEl = utils_createElement("div", swiper.params.wrapperClass);
                el.append(wrapperEl);
                utils_elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl => {
                    wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                el,
                wrapperEl,
                slidesEl: swiper.isElement ? el : wrapperEl,
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === elementStyle(el, "direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === elementStyle(el, "direction")),
                wrongRTL: "-webkit-box" === elementStyle(wrapperEl, "display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            if (swiper.params.loop) swiper.loopCreate();
            swiper.attachEvents();
            [ ...swiper.el.querySelectorAll('[loading="lazy"]') ].forEach((imageEl => {
                if (imageEl.complete) processLazyPreloader(swiper, imageEl); else imageEl.addEventListener("load", (e => {
                    processLazyPreloader(swiper, e.target);
                }));
            }));
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance = true, cleanStyles = true) {
            const swiper = this;
            const {params, el, wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                el.removeAttribute("style");
                wrapperEl.removeAttribute("style");
                if (slides && slides.length) slides.forEach((slideEl => {
                    slideEl.classList.remove(params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
                    slideEl.removeAttribute("style");
                    slideEl.removeAttribute("data-swiper-slide-index");
                }));
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.el.swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = utils_elementChildren(swiper.el, `.${checkProps[key]}`)[0];
                if (!element) {
                    element = utils_createElement("div", checkProps[key]);
                    element.className = checkProps[key];
                    swiper.el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation({swiper, extendParams, on, emit}) {
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            prevEl: null
        };
        const makeElementsArray = el => {
            if (!Array.isArray(el)) el = [ el ].filter((e => !!e));
            return el;
        };
        function getEl(el) {
            let res;
            if (el && "string" === typeof el && swiper.isElement) {
                res = swiper.el.shadowRoot.querySelector(el);
                if (res) return res;
            }
            if (el) {
                if ("string" === typeof el) res = [ ...document.querySelectorAll(el) ];
                if (swiper.params.uniqueNavElements && "string" === typeof el && res.length > 1 && 1 === swiper.el.querySelectorAll(el).length) res = swiper.el.querySelector(el);
            }
            if (el && !res) return el;
            return res;
        }
        function toggleEl(el, disabled) {
            const params = swiper.params.navigation;
            el = makeElementsArray(el);
            el.forEach((subEl => {
                if (subEl) {
                    subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
                    if ("BUTTON" === subEl.tagName) subEl.disabled = disabled;
                    if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
                }
            }));
        }
        function update() {
            const {nextEl, prevEl} = swiper.navigation;
            if (swiper.params.loop) {
                toggleEl(prevEl, false);
                toggleEl(nextEl, false);
                return;
            }
            toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            let nextEl = getEl(params.nextEl);
            let prevEl = getEl(params.prevEl);
            Object.assign(swiper.navigation, {
                nextEl,
                prevEl
            });
            nextEl = makeElementsArray(nextEl);
            prevEl = makeElementsArray(prevEl);
            const initButton = (el, dir) => {
                if (el) el.addEventListener("click", "next" === dir ? onNextClick : onPrevClick);
                if (!swiper.enabled && el) el.classList.add(...params.lockClass.split(" "));
            };
            nextEl.forEach((el => initButton(el, "next")));
            prevEl.forEach((el => initButton(el, "prev")));
        }
        function destroy() {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = makeElementsArray(nextEl);
            prevEl = makeElementsArray(prevEl);
            const destroyButton = (el, dir) => {
                el.removeEventListener("click", "next" === dir ? onNextClick : onPrevClick);
                el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
            };
            nextEl.forEach((el => destroyButton(el, "next")));
            prevEl.forEach((el => destroyButton(el, "prev")));
        }
        on("init", (() => {
            if (false === swiper.params.navigation.enabled) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = makeElementsArray(nextEl);
            prevEl = makeElementsArray(prevEl);
            [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList[swiper.enabled ? "remove" : "add"](swiper.params.navigation.lockClass)));
        }));
        on("click", ((_s, e) => {
            let {nextEl, prevEl} = swiper.navigation;
            nextEl = makeElementsArray(nextEl);
            prevEl = makeElementsArray(prevEl);
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if (nextEl.length) isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass); else if (prevEl.length) isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.toggle(swiper.params.navigation.hiddenClass)));
            }
        }));
        const enable = () => {
            swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
            init();
            update();
        };
        const disable = () => {
            swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function initSliders() {
        if (document.querySelector(".swiper")) {
            new core(".goods__slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                lazy: true,
                spaceBetween: 20,
                speed: 800,
                parallax: true,
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next"
                },
                breakpoints: {},
                on: {}
            });
            new core(".brick__slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 2,
                spaceBetween: 30,
                speed: 800,
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next"
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1.1,
                        spaceBetween: 15
                    },
                    500: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    992: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    1268: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    }
                },
                on: {}
            });
            new core(".warrior__slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 2,
                spaceBetween: 30,
                speed: 800,
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next"
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1.1,
                        spaceBetween: 15
                    },
                    500: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    992: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    1268: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        loopedSlides: 3
                    }
                },
                on: {}
            });
            new core(".typebrick__slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 2,
                lazy: true,
                spaceBetween: 20,
                autoHeight: true,
                speed: 800,
                parallax: true,
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next"
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                    1268: {
                        slidesPerView: 4,
                        spaceBetween: 30
                    }
                },
                on: {}
            });
        }
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            }
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root) ;
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) return;
            if ("prx" === paramsWatch.threshold) {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null; else targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if ("click" === e.type) {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (null !== fullpageSectionId) {
                            flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if ("watcherCallback" === e.type && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if ("navigator" === targetElement.dataset.watch) {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
            writable: false
        });
        return Constructor;
    }
    function _defineProperty(obj, key, value) {
        if (key in obj) Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        }); else obj[key] = value;
        return obj;
    }
    function _inherits(subClass, superClass) {
        if ("function" !== typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        Object.defineProperty(subClass, "prototype", {
            writable: false
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _setPrototypeOf(o, p);
    }
    function _isNativeReflectConstruct() {
        if ("undefined" === typeof Reflect || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if ("function" === typeof Proxy) return true;
        try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {})));
            return true;
        } catch (e) {
            return false;
        }
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
        if (null == source) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }
        return target;
    }
    function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i = 0; i < sourceSymbolKeys.length; i++) {
                key = sourceSymbolKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
                target[key] = source[key];
            }
        }
        return target;
    }
    function _assertThisInitialized(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    }
    function _possibleConstructorReturn(self, call) {
        if (call && ("object" === typeof call || "function" === typeof call)) return call; else if (void 0 !== call) throw new TypeError("Derived constructors may only return object or undefined");
        return _assertThisInitialized(self);
    }
    function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
            var result, Super = _getPrototypeOf(Derived);
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else result = Super.apply(this, arguments);
            return _possibleConstructorReturn(this, result);
        };
    }
    function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (null === object) break;
        }
        return object;
    }
    function _get() {
        if ("undefined" !== typeof Reflect && Reflect.get) _get = Reflect.get.bind(); else _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) return desc.get.call(arguments.length < 3 ? target : receiver);
            return desc.value;
        };
        return _get.apply(this, arguments);
    }
    function set(target, property, value, receiver) {
        if ("undefined" !== typeof Reflect && Reflect.set) set = Reflect.set; else set = function set(target, property, value, receiver) {
            var base = _superPropBase(target, property);
            var desc;
            if (base) {
                desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.set) {
                    desc.set.call(receiver, value);
                    return true;
                } else if (!desc.writable) return false;
            }
            desc = Object.getOwnPropertyDescriptor(receiver, property);
            if (desc) {
                if (!desc.writable) return false;
                desc.value = value;
                Object.defineProperty(receiver, property, desc);
            } else _defineProperty(receiver, property, value);
            return true;
        };
        return set(target, property, value, receiver);
    }
    function _set(target, property, value, receiver, isStrict) {
        var s = set(target, property, value, receiver || target);
        if (!s && isStrict) throw new Error("failed to set property");
        return value;
    }
    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function _iterableToArray(iter) {
        if ("undefined" !== typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    }
    function _iterableToArrayLimit(arr, i) {
        var _i = null == arr ? null : "undefined" !== typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null == _i) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && null != _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor) n = o.constructor.name;
        if ("Map" === n || "Set" === n) return Array.from(o);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
        if (null == len || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
    }
    function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var ChangeDetails = function() {
        function ChangeDetails(details) {
            _classCallCheck(this, ChangeDetails);
            Object.assign(this, {
                inserted: "",
                rawInserted: "",
                skip: false,
                tailShift: 0
            }, details);
        }
        _createClass(ChangeDetails, [ {
            key: "aggregate",
            value: function aggregate(details) {
                this.rawInserted += details.rawInserted;
                this.skip = this.skip || details.skip;
                this.inserted += details.inserted;
                this.tailShift += details.tailShift;
                return this;
            }
        }, {
            key: "offset",
            get: function get() {
                return this.tailShift + this.inserted.length;
            }
        } ]);
        return ChangeDetails;
    }();
    function isString(str) {
        return "string" === typeof str || str instanceof String;
    }
    var DIRECTION = {
        NONE: "NONE",
        LEFT: "LEFT",
        FORCE_LEFT: "FORCE_LEFT",
        RIGHT: "RIGHT",
        FORCE_RIGHT: "FORCE_RIGHT"
    };
    function forceDirection(direction) {
        switch (direction) {
          case DIRECTION.LEFT:
            return DIRECTION.FORCE_LEFT;

          case DIRECTION.RIGHT:
            return DIRECTION.FORCE_RIGHT;

          default:
            return direction;
        }
    }
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    }
    function normalizePrepare(prep) {
        return Array.isArray(prep) ? prep : [ prep, new ChangeDetails ];
    }
    function objectIncludes(b, a) {
        if (a === b) return true;
        var i, arrA = Array.isArray(a), arrB = Array.isArray(b);
        if (arrA && arrB) {
            if (a.length != b.length) return false;
            for (i = 0; i < a.length; i++) if (!objectIncludes(a[i], b[i])) return false;
            return true;
        }
        if (arrA != arrB) return false;
        if (a && b && "object" === _typeof(a) && "object" === _typeof(b)) {
            var dateA = a instanceof Date, dateB = b instanceof Date;
            if (dateA && dateB) return a.getTime() == b.getTime();
            if (dateA != dateB) return false;
            var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
            if (regexpA && regexpB) return a.toString() == b.toString();
            if (regexpA != regexpB) return false;
            var keys = Object.keys(a);
            for (i = 0; i < keys.length; i++) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
            for (i = 0; i < keys.length; i++) if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
            return true;
        } else if (a && b && "function" === typeof a && "function" === typeof b) return a.toString() === b.toString();
        return false;
    }
    var ActionDetails = function() {
        function ActionDetails(value, cursorPos, oldValue, oldSelection) {
            _classCallCheck(this, ActionDetails);
            this.value = value;
            this.cursorPos = cursorPos;
            this.oldValue = oldValue;
            this.oldSelection = oldSelection;
            while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) --this.oldSelection.start;
        }
        _createClass(ActionDetails, [ {
            key: "startChangePos",
            get: function get() {
                return Math.min(this.cursorPos, this.oldSelection.start);
            }
        }, {
            key: "insertedCount",
            get: function get() {
                return this.cursorPos - this.startChangePos;
            }
        }, {
            key: "inserted",
            get: function get() {
                return this.value.substr(this.startChangePos, this.insertedCount);
            }
        }, {
            key: "removedCount",
            get: function get() {
                return Math.max(this.oldSelection.end - this.startChangePos || this.oldValue.length - this.value.length, 0);
            }
        }, {
            key: "removed",
            get: function get() {
                return this.oldValue.substr(this.startChangePos, this.removedCount);
            }
        }, {
            key: "head",
            get: function get() {
                return this.value.substring(0, this.startChangePos);
            }
        }, {
            key: "tail",
            get: function get() {
                return this.value.substring(this.startChangePos + this.insertedCount);
            }
        }, {
            key: "removeDirection",
            get: function get() {
                if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
                return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
            }
        } ]);
        return ActionDetails;
    }();
    var ContinuousTailDetails = function() {
        function ContinuousTailDetails() {
            var value = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            var from = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            var stop = arguments.length > 2 ? arguments[2] : void 0;
            _classCallCheck(this, ContinuousTailDetails);
            this.value = value;
            this.from = from;
            this.stop = stop;
        }
        _createClass(ContinuousTailDetails, [ {
            key: "toString",
            value: function toString() {
                return this.value;
            }
        }, {
            key: "extend",
            value: function extend(tail) {
                this.value += String(tail);
            }
        }, {
            key: "appendTo",
            value: function appendTo(masked) {
                return masked.append(this.toString(), {
                    tail: true
                }).aggregate(masked._appendPlaceholder());
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    value: this.value,
                    from: this.from,
                    stop: this.stop
                };
            },
            set: function set(state) {
                Object.assign(this, state);
            }
        }, {
            key: "unshift",
            value: function unshift(beforePos) {
                if (!this.value.length || null != beforePos && this.from >= beforePos) return "";
                var shiftChar = this.value[0];
                this.value = this.value.slice(1);
                return shiftChar;
            }
        }, {
            key: "shift",
            value: function shift() {
                if (!this.value.length) return "";
                var shiftChar = this.value[this.value.length - 1];
                this.value = this.value.slice(0, -1);
                return shiftChar;
            }
        } ]);
        return ContinuousTailDetails;
    }();
    function IMask(el) {
        var opts = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new IMask.InputMask(el, opts);
    }
    var Masked = function() {
        function Masked(opts) {
            _classCallCheck(this, Masked);
            this._value = "";
            this._update(Object.assign({}, Masked.DEFAULTS, opts));
            this.isInitialized = true;
        }
        _createClass(Masked, [ {
            key: "updateOptions",
            value: function updateOptions(opts) {
                if (!Object.keys(opts).length) return;
                this.withValueRefresh(this._update.bind(this, opts));
            }
        }, {
            key: "_update",
            value: function _update(opts) {
                Object.assign(this, opts);
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    _value: this.value
                };
            },
            set: function set(state) {
                this._value = state._value;
            }
        }, {
            key: "reset",
            value: function reset() {
                this._value = "";
            }
        }, {
            key: "value",
            get: function get() {
                return this._value;
            },
            set: function set(value) {
                this.resolve(value);
            }
        }, {
            key: "resolve",
            value: function resolve(value) {
                this.reset();
                this.append(value, {
                    input: true
                }, "");
                this.doCommit();
                return this.value;
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.value;
            },
            set: function set(value) {
                this.reset();
                this.append(value, {}, "");
                this.doCommit();
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.doParse(this.value);
            },
            set: function set(value) {
                this.value = this.doFormat(value);
            }
        }, {
            key: "rawInputValue",
            get: function get() {
                return this.extractInput(0, this.value.length, {
                    raw: true
                });
            },
            set: function set(value) {
                this.reset();
                this.append(value, {
                    raw: true
                }, "");
                this.doCommit();
            }
        }, {
            key: "isComplete",
            get: function get() {
                return true;
            }
        }, {
            key: "isFilled",
            get: function get() {
                return this.isComplete;
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos, direction) {
                return cursorPos;
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                return this.value.slice(fromPos, toPos);
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
            }
        }, {
            key: "appendTail",
            value: function appendTail(tail) {
                if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
                return tail.appendTo(this);
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                if (!ch) return new ChangeDetails;
                this._value += ch;
                return new ChangeDetails({
                    inserted: ch,
                    rawInserted: ch
                });
            }
        }, {
            key: "_appendChar",
            value: function _appendChar(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var checkTail = arguments.length > 2 ? arguments[2] : void 0;
                var consistentState = this.state;
                var details;
                var _normalizePrepare = normalizePrepare(this.doPrepare(ch, flags));
                var _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2);
                ch = _normalizePrepare2[0];
                details = _normalizePrepare2[1];
                details = details.aggregate(this._appendCharRaw(ch, flags));
                if (details.inserted) {
                    var consistentTail;
                    var appended = false !== this.doValidate(flags);
                    if (appended && null != checkTail) {
                        var beforeTailState = this.state;
                        if (true === this.overwrite) {
                            consistentTail = checkTail.state;
                            checkTail.unshift(this.value.length);
                        }
                        var tailDetails = this.appendTail(checkTail);
                        appended = tailDetails.rawInserted === checkTail.toString();
                        if (!(appended && tailDetails.inserted) && "shift" === this.overwrite) {
                            this.state = beforeTailState;
                            consistentTail = checkTail.state;
                            checkTail.shift();
                            tailDetails = this.appendTail(checkTail);
                            appended = tailDetails.rawInserted === checkTail.toString();
                        }
                        if (appended && tailDetails.inserted) this.state = beforeTailState;
                    }
                    if (!appended) {
                        details = new ChangeDetails;
                        this.state = consistentState;
                        if (checkTail && consistentTail) checkTail.state = consistentTail;
                    }
                }
                return details;
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                return new ChangeDetails;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                return new ChangeDetails;
            }
        }, {
            key: "append",
            value: function append(str, flags, tail) {
                if (!isString(str)) throw new Error("value should be string");
                var details = new ChangeDetails;
                var checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
                if (null !== flags && void 0 !== flags && flags.tail) flags._beforeTailState = this.state;
                for (var ci = 0; ci < str.length; ++ci) details.aggregate(this._appendChar(str[ci], flags, checkTail));
                if (null != checkTail) details.tailShift += this.appendTail(checkTail).tailShift;
                if (this.eager && null !== flags && void 0 !== flags && flags.input && str) details.aggregate(this._appendEager());
                return details;
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
                return new ChangeDetails;
            }
        }, {
            key: "withValueRefresh",
            value: function withValueRefresh(fn) {
                if (this._refreshing || !this.isInitialized) return fn();
                this._refreshing = true;
                var rawInput = this.rawInputValue;
                var value = this.value;
                var ret = fn();
                this.rawInputValue = rawInput;
                if (this.value && this.value !== value && 0 === value.indexOf(this.value)) this.append(value.slice(this.value.length), {}, "");
                delete this._refreshing;
                return ret;
            }
        }, {
            key: "runIsolated",
            value: function runIsolated(fn) {
                if (this._isolated || !this.isInitialized) return fn(this);
                this._isolated = true;
                var state = this.state;
                var ret = fn(this);
                this.state = state;
                delete this._isolated;
                return ret;
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(str) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return this.prepare ? this.prepare(str, this, flags) : str;
            }
        }, {
            key: "doValidate",
            value: function doValidate(flags) {
                return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                if (this.commit) this.commit(this.value, this);
            }
        }, {
            key: "doFormat",
            value: function doFormat(value) {
                return this.format ? this.format(value, this) : value;
            }
        }, {
            key: "doParse",
            value: function doParse(str) {
                return this.parse ? this.parse(str, this) : str;
            }
        }, {
            key: "splice",
            value: function splice(start, deleteCount, inserted, removeDirection) {
                var flags = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {
                    input: true
                };
                var tailPos = start + deleteCount;
                var tail = this.extractTail(tailPos);
                var oldRawValue;
                if (this.eager) {
                    removeDirection = forceDirection(removeDirection);
                    oldRawValue = this.extractInput(0, tailPos, {
                        raw: true
                    });
                }
                var startChangePos = this.nearestInputPos(start, deleteCount > 1 && 0 !== start && !this.eager ? DIRECTION.NONE : removeDirection);
                var details = new ChangeDetails({
                    tailShift: startChangePos - start
                }).aggregate(this.remove(startChangePos));
                if (this.eager && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) if (removeDirection === DIRECTION.FORCE_LEFT) {
                    var valLength;
                    while (oldRawValue === this.rawInputValue && (valLength = this.value.length)) details.aggregate(new ChangeDetails({
                        tailShift: -1
                    })).aggregate(this.remove(valLength - 1));
                } else if (removeDirection === DIRECTION.FORCE_RIGHT) tail.unshift();
                return details.aggregate(this.append(inserted, flags, tail));
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                return this.mask === mask;
            }
        }, {
            key: "typedValueEquals",
            value: function typedValueEquals(value) {
                var tval = this.typedValue;
                return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || this.doFormat(value) === this.doFormat(this.typedValue);
            }
        } ]);
        return Masked;
    }();
    Masked.DEFAULTS = {
        format: function format(v) {
            return v;
        },
        parse: function parse(v) {
            return v;
        }
    };
    Masked.EMPTY_VALUES = [ void 0, null, "" ];
    IMask.Masked = Masked;
    function maskedClass(mask) {
        if (null == mask) throw new Error("mask property should be defined");
        if (mask instanceof RegExp) return IMask.MaskedRegExp;
        if (isString(mask)) return IMask.MaskedPattern;
        if (mask instanceof Date || mask === Date) return IMask.MaskedDate;
        if (mask instanceof Number || "number" === typeof mask || mask === Number) return IMask.MaskedNumber;
        if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
        if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
        if (mask instanceof IMask.Masked) return mask.constructor;
        if (mask instanceof Function) return IMask.MaskedFunction;
        console.warn("Mask not found for mask", mask);
        return IMask.Masked;
    }
    function createMask(opts) {
        if (IMask.Masked && opts instanceof IMask.Masked) return opts;
        opts = Object.assign({}, opts);
        var mask = opts.mask;
        if (IMask.Masked && mask instanceof IMask.Masked) return mask;
        var MaskedClass = maskedClass(mask);
        if (!MaskedClass) throw new Error("Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.");
        return new MaskedClass(opts);
    }
    IMask.createMask = createMask;
    var _excluded = [ "mask" ];
    var DEFAULT_INPUT_DEFINITIONS = {
        0: /\d/,
        a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        "*": /./
    };
    var PatternInputDefinition = function() {
        function PatternInputDefinition(opts) {
            _classCallCheck(this, PatternInputDefinition);
            var mask = opts.mask, blockOpts = _objectWithoutProperties(opts, _excluded);
            this.masked = createMask({
                mask
            });
            Object.assign(this, blockOpts);
        }
        _createClass(PatternInputDefinition, [ {
            key: "reset",
            value: function reset() {
                this.isFilled = false;
                this.masked.reset();
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                if (0 === fromPos && toPos >= 1) {
                    this.isFilled = false;
                    return this.masked.remove(fromPos, toPos);
                }
                return new ChangeDetails;
            }
        }, {
            key: "value",
            get: function get() {
                return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.masked.unmaskedValue;
            }
        }, {
            key: "isComplete",
            get: function get() {
                return Boolean(this.masked.value) || this.isOptional;
            }
        }, {
            key: "_appendChar",
            value: function _appendChar(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (this.isFilled) return new ChangeDetails;
                var state = this.masked.state;
                var details = this.masked._appendChar(ch, flags);
                if (details.inserted && false === this.doValidate(flags)) {
                    details.inserted = details.rawInserted = "";
                    this.masked.state = state;
                }
                if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) details.inserted = this.placeholderChar;
                details.skip = !details.inserted && !this.isOptional;
                this.isFilled = Boolean(details.inserted);
                return details;
            }
        }, {
            key: "append",
            value: function append() {
                var _this$masked;
                return (_this$masked = this.masked).append.apply(_this$masked, arguments);
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                var details = new ChangeDetails;
                if (this.isFilled || this.isOptional) return details;
                this.isFilled = true;
                details.inserted = this.placeholderChar;
                return details;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                return new ChangeDetails;
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var _this$masked2;
                return (_this$masked2 = this.masked).extractTail.apply(_this$masked2, arguments);
            }
        }, {
            key: "appendTail",
            value: function appendTail() {
                var _this$masked3;
                return (_this$masked3 = this.masked).appendTail.apply(_this$masked3, arguments);
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var flags = arguments.length > 2 ? arguments[2] : void 0;
                return this.masked.extractInput(fromPos, toPos, flags);
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos) {
                var direction = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : DIRECTION.NONE;
                var minPos = 0;
                var maxPos = this.value.length;
                var boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
                switch (direction) {
                  case DIRECTION.LEFT:
                  case DIRECTION.FORCE_LEFT:
                    return this.isComplete ? boundPos : minPos;

                  case DIRECTION.RIGHT:
                  case DIRECTION.FORCE_RIGHT:
                    return this.isComplete ? boundPos : maxPos;

                  case DIRECTION.NONE:
                  default:
                    return boundPos;
                }
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _this$masked4, _this$parent;
                return (_this$masked4 = this.masked).doValidate.apply(_this$masked4, arguments) && (!this.parent || (_this$parent = this.parent).doValidate.apply(_this$parent, arguments));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                this.masked.doCommit();
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    masked: this.masked.state,
                    isFilled: this.isFilled
                };
            },
            set: function set(state) {
                this.masked.state = state.masked;
                this.isFilled = state.isFilled;
            }
        } ]);
        return PatternInputDefinition;
    }();
    var PatternFixedDefinition = function() {
        function PatternFixedDefinition(opts) {
            _classCallCheck(this, PatternFixedDefinition);
            Object.assign(this, opts);
            this._value = "";
            this.isFixed = true;
        }
        _createClass(PatternFixedDefinition, [ {
            key: "value",
            get: function get() {
                return this._value;
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.isUnmasking ? this.value : "";
            }
        }, {
            key: "reset",
            value: function reset() {
                this._isRawInput = false;
                this._value = "";
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this._value.length;
                this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
                if (!this._value) this._isRawInput = false;
                return new ChangeDetails;
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos) {
                var direction = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : DIRECTION.NONE;
                var minPos = 0;
                var maxPos = this._value.length;
                switch (direction) {
                  case DIRECTION.LEFT:
                  case DIRECTION.FORCE_LEFT:
                    return minPos;

                  case DIRECTION.NONE:
                  case DIRECTION.RIGHT:
                  case DIRECTION.FORCE_RIGHT:
                  default:
                    return maxPos;
                }
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this._value.length;
                var flags = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || "";
            }
        }, {
            key: "isComplete",
            get: function get() {
                return true;
            }
        }, {
            key: "isFilled",
            get: function get() {
                return Boolean(this._value);
            }
        }, {
            key: "_appendChar",
            value: function _appendChar(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var details = new ChangeDetails;
                if (this._value) return details;
                var appended = this.char === ch;
                var isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !this.eager) && !flags.tail;
                if (isResolved) details.rawInserted = this.char;
                this._value = details.inserted = this.char;
                this._isRawInput = isResolved && (flags.raw || flags.input);
                return details;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                return this._appendChar(this.char, {
                    tail: true
                });
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                var details = new ChangeDetails;
                if (this._value) return details;
                this._value = details.inserted = this.char;
                return details;
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                return new ContinuousTailDetails("");
            }
        }, {
            key: "appendTail",
            value: function appendTail(tail) {
                if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
                return tail.appendTo(this);
            }
        }, {
            key: "append",
            value: function append(str, flags, tail) {
                var details = this._appendChar(str[0], flags);
                if (null != tail) details.tailShift += this.appendTail(tail).tailShift;
                return details;
            }
        }, {
            key: "doCommit",
            value: function doCommit() {}
        }, {
            key: "state",
            get: function get() {
                return {
                    _value: this._value,
                    _isRawInput: this._isRawInput
                };
            },
            set: function set(state) {
                Object.assign(this, state);
            }
        } ]);
        return PatternFixedDefinition;
    }();
    var chunk_tail_details_excluded = [ "chunks" ];
    var ChunksTailDetails = function() {
        function ChunksTailDetails() {
            var chunks = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
            var from = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            _classCallCheck(this, ChunksTailDetails);
            this.chunks = chunks;
            this.from = from;
        }
        _createClass(ChunksTailDetails, [ {
            key: "toString",
            value: function toString() {
                return this.chunks.map(String).join("");
            }
        }, {
            key: "extend",
            value: function extend(tailChunk) {
                if (!String(tailChunk)) return;
                if (isString(tailChunk)) tailChunk = new ContinuousTailDetails(String(tailChunk));
                var lastChunk = this.chunks[this.chunks.length - 1];
                var extendLast = lastChunk && (lastChunk.stop === tailChunk.stop || null == tailChunk.stop) && tailChunk.from === lastChunk.from + lastChunk.toString().length;
                if (tailChunk instanceof ContinuousTailDetails) if (extendLast) lastChunk.extend(tailChunk.toString()); else this.chunks.push(tailChunk); else if (tailChunk instanceof ChunksTailDetails) {
                    if (null == tailChunk.stop) {
                        var firstTailChunk;
                        while (tailChunk.chunks.length && null == tailChunk.chunks[0].stop) {
                            firstTailChunk = tailChunk.chunks.shift();
                            firstTailChunk.from += tailChunk.from;
                            this.extend(firstTailChunk);
                        }
                    }
                    if (tailChunk.toString()) {
                        tailChunk.stop = tailChunk.blockIndex;
                        this.chunks.push(tailChunk);
                    }
                }
            }
        }, {
            key: "appendTo",
            value: function appendTo(masked) {
                if (!(masked instanceof IMask.MaskedPattern)) {
                    var tail = new ContinuousTailDetails(this.toString());
                    return tail.appendTo(masked);
                }
                var details = new ChangeDetails;
                for (var ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
                    var chunk = this.chunks[ci];
                    var lastBlockIter = masked._mapPosToBlock(masked.value.length);
                    var stop = chunk.stop;
                    var chunkBlock = void 0;
                    if (null != stop && (!lastBlockIter || lastBlockIter.index <= stop)) {
                        if (chunk instanceof ChunksTailDetails || masked._stops.indexOf(stop) >= 0) details.aggregate(masked._appendPlaceholder(stop));
                        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
                    }
                    if (chunkBlock) {
                        var tailDetails = chunkBlock.appendTail(chunk);
                        tailDetails.skip = false;
                        details.aggregate(tailDetails);
                        masked._value += tailDetails.inserted;
                        var remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
                        if (remainChars) details.aggregate(masked.append(remainChars, {
                            tail: true
                        }));
                    } else details.aggregate(masked.append(chunk.toString(), {
                        tail: true
                    }));
                }
                return details;
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    chunks: this.chunks.map((function(c) {
                        return c.state;
                    })),
                    from: this.from,
                    stop: this.stop,
                    blockIndex: this.blockIndex
                };
            },
            set: function set(state) {
                var chunks = state.chunks, props = _objectWithoutProperties(state, chunk_tail_details_excluded);
                Object.assign(this, props);
                this.chunks = chunks.map((function(cstate) {
                    var chunk = "chunks" in cstate ? new ChunksTailDetails : new ContinuousTailDetails;
                    chunk.state = cstate;
                    return chunk;
                }));
            }
        }, {
            key: "unshift",
            value: function unshift(beforePos) {
                if (!this.chunks.length || null != beforePos && this.from >= beforePos) return "";
                var chunkShiftPos = null != beforePos ? beforePos - this.from : beforePos;
                var ci = 0;
                while (ci < this.chunks.length) {
                    var chunk = this.chunks[ci];
                    var shiftChar = chunk.unshift(chunkShiftPos);
                    if (chunk.toString()) {
                        if (!shiftChar) break;
                        ++ci;
                    } else this.chunks.splice(ci, 1);
                    if (shiftChar) return shiftChar;
                }
                return "";
            }
        }, {
            key: "shift",
            value: function shift() {
                if (!this.chunks.length) return "";
                var ci = this.chunks.length - 1;
                while (0 <= ci) {
                    var chunk = this.chunks[ci];
                    var shiftChar = chunk.shift();
                    if (chunk.toString()) {
                        if (!shiftChar) break;
                        --ci;
                    } else this.chunks.splice(ci, 1);
                    if (shiftChar) return shiftChar;
                }
                return "";
            }
        } ]);
        return ChunksTailDetails;
    }();
    var PatternCursor = function() {
        function PatternCursor(masked, pos) {
            _classCallCheck(this, PatternCursor);
            this.masked = masked;
            this._log = [];
            var _ref = masked._mapPosToBlock(pos) || (pos < 0 ? {
                index: 0,
                offset: 0
            } : {
                index: this.masked._blocks.length,
                offset: 0
            }), offset = _ref.offset, index = _ref.index;
            this.offset = offset;
            this.index = index;
            this.ok = false;
        }
        _createClass(PatternCursor, [ {
            key: "block",
            get: function get() {
                return this.masked._blocks[this.index];
            }
        }, {
            key: "pos",
            get: function get() {
                return this.masked._blockStartPos(this.index) + this.offset;
            }
        }, {
            key: "state",
            get: function get() {
                return {
                    index: this.index,
                    offset: this.offset,
                    ok: this.ok
                };
            },
            set: function set(s) {
                Object.assign(this, s);
            }
        }, {
            key: "pushState",
            value: function pushState() {
                this._log.push(this.state);
            }
        }, {
            key: "popState",
            value: function popState() {
                var s = this._log.pop();
                this.state = s;
                return s;
            }
        }, {
            key: "bindBlock",
            value: function bindBlock() {
                if (this.block) return;
                if (this.index < 0) {
                    this.index = 0;
                    this.offset = 0;
                }
                if (this.index >= this.masked._blocks.length) {
                    this.index = this.masked._blocks.length - 1;
                    this.offset = this.block.value.length;
                }
            }
        }, {
            key: "_pushLeft",
            value: function _pushLeft(fn) {
                this.pushState();
                for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = (null === (_this$block = this.block) || void 0 === _this$block ? void 0 : _this$block.value.length) || 0) {
                    var _this$block;
                    if (fn()) return this.ok = true;
                }
                return this.ok = false;
            }
        }, {
            key: "_pushRight",
            value: function _pushRight(fn) {
                this.pushState();
                for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) if (fn()) return this.ok = true;
                return this.ok = false;
            }
        }, {
            key: "pushLeftBeforeFilled",
            value: function pushLeftBeforeFilled() {
                var _this = this;
                return this._pushLeft((function() {
                    if (_this.block.isFixed || !_this.block.value) return;
                    _this.offset = _this.block.nearestInputPos(_this.offset, DIRECTION.FORCE_LEFT);
                    if (0 !== _this.offset) return true;
                }));
            }
        }, {
            key: "pushLeftBeforeInput",
            value: function pushLeftBeforeInput() {
                var _this2 = this;
                return this._pushLeft((function() {
                    if (_this2.block.isFixed) return;
                    _this2.offset = _this2.block.nearestInputPos(_this2.offset, DIRECTION.LEFT);
                    return true;
                }));
            }
        }, {
            key: "pushLeftBeforeRequired",
            value: function pushLeftBeforeRequired() {
                var _this3 = this;
                return this._pushLeft((function() {
                    if (_this3.block.isFixed || _this3.block.isOptional && !_this3.block.value) return;
                    _this3.offset = _this3.block.nearestInputPos(_this3.offset, DIRECTION.LEFT);
                    return true;
                }));
            }
        }, {
            key: "pushRightBeforeFilled",
            value: function pushRightBeforeFilled() {
                var _this4 = this;
                return this._pushRight((function() {
                    if (_this4.block.isFixed || !_this4.block.value) return;
                    _this4.offset = _this4.block.nearestInputPos(_this4.offset, DIRECTION.FORCE_RIGHT);
                    if (_this4.offset !== _this4.block.value.length) return true;
                }));
            }
        }, {
            key: "pushRightBeforeInput",
            value: function pushRightBeforeInput() {
                var _this5 = this;
                return this._pushRight((function() {
                    if (_this5.block.isFixed) return;
                    _this5.offset = _this5.block.nearestInputPos(_this5.offset, DIRECTION.NONE);
                    return true;
                }));
            }
        }, {
            key: "pushRightBeforeRequired",
            value: function pushRightBeforeRequired() {
                var _this6 = this;
                return this._pushRight((function() {
                    if (_this6.block.isFixed || _this6.block.isOptional && !_this6.block.value) return;
                    _this6.offset = _this6.block.nearestInputPos(_this6.offset, DIRECTION.NONE);
                    return true;
                }));
            }
        } ]);
        return PatternCursor;
    }();
    var MaskedRegExp = function(_Masked) {
        _inherits(MaskedRegExp, _Masked);
        var _super = _createSuper(MaskedRegExp);
        function MaskedRegExp() {
            _classCallCheck(this, MaskedRegExp);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedRegExp, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.mask) opts.validate = function(value) {
                    return value.search(opts.mask) >= 0;
                };
                _get(_getPrototypeOf(MaskedRegExp.prototype), "_update", this).call(this, opts);
            }
        } ]);
        return MaskedRegExp;
    }(Masked);
    IMask.MaskedRegExp = MaskedRegExp;
    var pattern_excluded = [ "_blocks" ];
    var MaskedPattern = function(_Masked) {
        _inherits(MaskedPattern, _Masked);
        var _super = _createSuper(MaskedPattern);
        function MaskedPattern() {
            var opts = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            _classCallCheck(this, MaskedPattern);
            opts.definitions = Object.assign({}, DEFAULT_INPUT_DEFINITIONS, opts.definitions);
            return _super.call(this, Object.assign({}, MaskedPattern.DEFAULTS, opts));
        }
        _createClass(MaskedPattern, [ {
            key: "_update",
            value: function _update() {
                var opts = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                opts.definitions = Object.assign({}, this.definitions, opts.definitions);
                _get(_getPrototypeOf(MaskedPattern.prototype), "_update", this).call(this, opts);
                this._rebuildMask();
            }
        }, {
            key: "_rebuildMask",
            value: function _rebuildMask() {
                var _this = this;
                var defs = this.definitions;
                this._blocks = [];
                this._stops = [];
                this._maskedBlocks = {};
                var pattern = this.mask;
                if (!pattern || !defs) return;
                var unmaskingBlock = false;
                var optionalBlock = false;
                for (var i = 0; i < pattern.length; ++i) {
                    if (this.blocks) {
                        var _ret = function() {
                            var p = pattern.slice(i);
                            var bNames = Object.keys(_this.blocks).filter((function(bName) {
                                return 0 === p.indexOf(bName);
                            }));
                            bNames.sort((function(a, b) {
                                return b.length - a.length;
                            }));
                            var bName = bNames[0];
                            if (bName) {
                                var maskedBlock = createMask(Object.assign({
                                    parent: _this,
                                    lazy: _this.lazy,
                                    eager: _this.eager,
                                    placeholderChar: _this.placeholderChar,
                                    overwrite: _this.overwrite
                                }, _this.blocks[bName]));
                                if (maskedBlock) {
                                    _this._blocks.push(maskedBlock);
                                    if (!_this._maskedBlocks[bName]) _this._maskedBlocks[bName] = [];
                                    _this._maskedBlocks[bName].push(_this._blocks.length - 1);
                                }
                                i += bName.length - 1;
                                return "continue";
                            }
                        }();
                        if ("continue" === _ret) continue;
                    }
                    var char = pattern[i];
                    var isInput = char in defs;
                    if (char === MaskedPattern.STOP_CHAR) {
                        this._stops.push(this._blocks.length);
                        continue;
                    }
                    if ("{" === char || "}" === char) {
                        unmaskingBlock = !unmaskingBlock;
                        continue;
                    }
                    if ("[" === char || "]" === char) {
                        optionalBlock = !optionalBlock;
                        continue;
                    }
                    if (char === MaskedPattern.ESCAPE_CHAR) {
                        ++i;
                        char = pattern[i];
                        if (!char) break;
                        isInput = false;
                    }
                    var def = isInput ? new PatternInputDefinition({
                        parent: this,
                        lazy: this.lazy,
                        eager: this.eager,
                        placeholderChar: this.placeholderChar,
                        mask: defs[char],
                        isOptional: optionalBlock
                    }) : new PatternFixedDefinition({
                        char,
                        eager: this.eager,
                        isUnmasking: unmaskingBlock
                    });
                    this._blocks.push(def);
                }
            }
        }, {
            key: "state",
            get: function get() {
                return Object.assign({}, _get(_getPrototypeOf(MaskedPattern.prototype), "state", this), {
                    _blocks: this._blocks.map((function(b) {
                        return b.state;
                    }))
                });
            },
            set: function set(state) {
                var _blocks = state._blocks, maskedState = _objectWithoutProperties(state, pattern_excluded);
                this._blocks.forEach((function(b, bi) {
                    return b.state = _blocks[bi];
                }));
                _set(_getPrototypeOf(MaskedPattern.prototype), "state", maskedState, this, true);
            }
        }, {
            key: "reset",
            value: function reset() {
                _get(_getPrototypeOf(MaskedPattern.prototype), "reset", this).call(this);
                this._blocks.forEach((function(b) {
                    return b.reset();
                }));
            }
        }, {
            key: "isComplete",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isComplete;
                }));
            }
        }, {
            key: "isFilled",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isFilled;
                }));
            }
        }, {
            key: "isFixed",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isFixed;
                }));
            }
        }, {
            key: "isOptional",
            get: function get() {
                return this._blocks.every((function(b) {
                    return b.isOptional;
                }));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                this._blocks.forEach((function(b) {
                    return b.doCommit();
                }));
                _get(_getPrototypeOf(MaskedPattern.prototype), "doCommit", this).call(this);
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this._blocks.reduce((function(str, b) {
                    return str += b.unmaskedValue;
                }), "");
            },
            set: function set(unmaskedValue) {
                _set(_getPrototypeOf(MaskedPattern.prototype), "unmaskedValue", unmaskedValue, this, true);
            }
        }, {
            key: "value",
            get: function get() {
                return this._blocks.reduce((function(str, b) {
                    return str += b.value;
                }), "");
            },
            set: function set(value) {
                _set(_getPrototypeOf(MaskedPattern.prototype), "value", value, this, true);
            }
        }, {
            key: "appendTail",
            value: function appendTail(tail) {
                return _get(_getPrototypeOf(MaskedPattern.prototype), "appendTail", this).call(this, tail).aggregate(this._appendPlaceholder());
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                var _this$_mapPosToBlock;
                var details = new ChangeDetails;
                var startBlockIndex = null === (_this$_mapPosToBlock = this._mapPosToBlock(this.value.length)) || void 0 === _this$_mapPosToBlock ? void 0 : _this$_mapPosToBlock.index;
                if (null == startBlockIndex) return details;
                if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
                for (var bi = startBlockIndex; bi < this._blocks.length; ++bi) {
                    var d = this._blocks[bi]._appendEager();
                    if (!d.inserted) break;
                    details.aggregate(d);
                }
                return details;
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var blockIter = this._mapPosToBlock(this.value.length);
                var details = new ChangeDetails;
                if (!blockIter) return details;
                for (var bi = blockIter.index; ;++bi) {
                    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
                    var _block = this._blocks[bi];
                    if (!_block) break;
                    var blockDetails = _block._appendChar(ch, Object.assign({}, flags, {
                        _beforeTailState: null === (_flags$_beforeTailSta = flags._beforeTailState) || void 0 === _flags$_beforeTailSta ? void 0 : null === (_flags$_beforeTailSta2 = _flags$_beforeTailSta._blocks) || void 0 === _flags$_beforeTailSta2 ? void 0 : _flags$_beforeTailSta2[bi]
                    }));
                    var skip = blockDetails.skip;
                    details.aggregate(blockDetails);
                    if (skip || blockDetails.rawInserted) break;
                }
                return details;
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var _this2 = this;
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var chunkTail = new ChunksTailDetails;
                if (fromPos === toPos) return chunkTail;
                this._forEachBlocksInRange(fromPos, toPos, (function(b, bi, bFromPos, bToPos) {
                    var blockChunk = b.extractTail(bFromPos, bToPos);
                    blockChunk.stop = _this2._findStopBefore(bi);
                    blockChunk.from = _this2._blockStartPos(bi);
                    if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
                    chunkTail.extend(blockChunk);
                }));
                return chunkTail;
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var flags = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                if (fromPos === toPos) return "";
                var input = "";
                this._forEachBlocksInRange(fromPos, toPos, (function(b, _, fromPos, toPos) {
                    input += b.extractInput(fromPos, toPos, flags);
                }));
                return input;
            }
        }, {
            key: "_findStopBefore",
            value: function _findStopBefore(blockIndex) {
                var stopBefore;
                for (var si = 0; si < this._stops.length; ++si) {
                    var stop = this._stops[si];
                    if (stop <= blockIndex) stopBefore = stop; else break;
                }
                return stopBefore;
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder(toBlockIndex) {
                var _this3 = this;
                var details = new ChangeDetails;
                if (this.lazy && null == toBlockIndex) return details;
                var startBlockIter = this._mapPosToBlock(this.value.length);
                if (!startBlockIter) return details;
                var startBlockIndex = startBlockIter.index;
                var endBlockIndex = null != toBlockIndex ? toBlockIndex : this._blocks.length;
                this._blocks.slice(startBlockIndex, endBlockIndex).forEach((function(b) {
                    if (!b.lazy || null != toBlockIndex) {
                        var args = null != b._blocks ? [ b._blocks.length ] : [];
                        var bDetails = b._appendPlaceholder.apply(b, args);
                        _this3._value += bDetails.inserted;
                        details.aggregate(bDetails);
                    }
                }));
                return details;
            }
        }, {
            key: "_mapPosToBlock",
            value: function _mapPosToBlock(pos) {
                var accVal = "";
                for (var bi = 0; bi < this._blocks.length; ++bi) {
                    var _block2 = this._blocks[bi];
                    var blockStartPos = accVal.length;
                    accVal += _block2.value;
                    if (pos <= accVal.length) return {
                        index: bi,
                        offset: pos - blockStartPos
                    };
                }
            }
        }, {
            key: "_blockStartPos",
            value: function _blockStartPos(blockIndex) {
                return this._blocks.slice(0, blockIndex).reduce((function(pos, b) {
                    return pos += b.value.length;
                }), 0);
            }
        }, {
            key: "_forEachBlocksInRange",
            value: function _forEachBlocksInRange(fromPos) {
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var fn = arguments.length > 2 ? arguments[2] : void 0;
                var fromBlockIter = this._mapPosToBlock(fromPos);
                if (fromBlockIter) {
                    var toBlockIter = this._mapPosToBlock(toPos);
                    var isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
                    var fromBlockStartPos = fromBlockIter.offset;
                    var fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
                    fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
                    if (toBlockIter && !isSameBlock) {
                        for (var bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
                        fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
                    }
                }
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var removeDetails = _get(_getPrototypeOf(MaskedPattern.prototype), "remove", this).call(this, fromPos, toPos);
                this._forEachBlocksInRange(fromPos, toPos, (function(b, _, bFromPos, bToPos) {
                    removeDetails.aggregate(b.remove(bFromPos, bToPos));
                }));
                return removeDetails;
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos) {
                var direction = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : DIRECTION.NONE;
                if (!this._blocks.length) return 0;
                var cursor = new PatternCursor(this, cursorPos);
                if (direction === DIRECTION.NONE) {
                    if (cursor.pushRightBeforeInput()) return cursor.pos;
                    cursor.popState();
                    if (cursor.pushLeftBeforeInput()) return cursor.pos;
                    return this.value.length;
                }
                if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
                    if (direction === DIRECTION.LEFT) {
                        cursor.pushRightBeforeFilled();
                        if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
                        cursor.popState();
                    }
                    cursor.pushLeftBeforeInput();
                    cursor.pushLeftBeforeRequired();
                    cursor.pushLeftBeforeFilled();
                    if (direction === DIRECTION.LEFT) {
                        cursor.pushRightBeforeInput();
                        cursor.pushRightBeforeRequired();
                        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
                        cursor.popState();
                        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
                        cursor.popState();
                    }
                    if (cursor.ok) return cursor.pos;
                    if (direction === DIRECTION.FORCE_LEFT) return 0;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    return 0;
                }
                if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
                    cursor.pushRightBeforeInput();
                    cursor.pushRightBeforeRequired();
                    if (cursor.pushRightBeforeFilled()) return cursor.pos;
                    if (direction === DIRECTION.FORCE_RIGHT) return this.value.length;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    cursor.popState();
                    if (cursor.ok) return cursor.pos;
                    return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
                }
                return cursorPos;
            }
        }, {
            key: "maskedBlock",
            value: function maskedBlock(name) {
                return this.maskedBlocks(name)[0];
            }
        }, {
            key: "maskedBlocks",
            value: function maskedBlocks(name) {
                var _this4 = this;
                var indices = this._maskedBlocks[name];
                if (!indices) return [];
                return indices.map((function(gi) {
                    return _this4._blocks[gi];
                }));
            }
        } ]);
        return MaskedPattern;
    }(Masked);
    MaskedPattern.DEFAULTS = {
        lazy: true,
        placeholderChar: "_"
    };
    MaskedPattern.STOP_CHAR = "`";
    MaskedPattern.ESCAPE_CHAR = "\\";
    MaskedPattern.InputDefinition = PatternInputDefinition;
    MaskedPattern.FixedDefinition = PatternFixedDefinition;
    IMask.MaskedPattern = MaskedPattern;
    var MaskedRange = function(_MaskedPattern) {
        _inherits(MaskedRange, _MaskedPattern);
        var _super = _createSuper(MaskedRange);
        function MaskedRange() {
            _classCallCheck(this, MaskedRange);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedRange, [ {
            key: "_matchFrom",
            get: function get() {
                return this.maxLength - String(this.from).length;
            }
        }, {
            key: "_update",
            value: function _update(opts) {
                opts = Object.assign({
                    to: this.to || 0,
                    from: this.from || 0,
                    maxLength: this.maxLength || 0
                }, opts);
                var maxLength = String(opts.to).length;
                if (null != opts.maxLength) maxLength = Math.max(maxLength, opts.maxLength);
                opts.maxLength = maxLength;
                var fromStr = String(opts.from).padStart(maxLength, "0");
                var toStr = String(opts.to).padStart(maxLength, "0");
                var sameCharsCount = 0;
                while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
                opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") + "0".repeat(maxLength - sameCharsCount);
                _get(_getPrototypeOf(MaskedRange.prototype), "_update", this).call(this, opts);
            }
        }, {
            key: "isComplete",
            get: function get() {
                return _get(_getPrototypeOf(MaskedRange.prototype), "isComplete", this) && Boolean(this.value);
            }
        }, {
            key: "boundaries",
            value: function boundaries(str) {
                var minstr = "";
                var maxstr = "";
                var _ref = str.match(/^(\D*)(\d*)(\D*)/) || [], _ref2 = _slicedToArray(_ref, 3), placeholder = _ref2[1], num = _ref2[2];
                if (num) {
                    minstr = "0".repeat(placeholder.length) + num;
                    maxstr = "9".repeat(placeholder.length) + num;
                }
                minstr = minstr.padEnd(this.maxLength, "0");
                maxstr = maxstr.padEnd(this.maxLength, "9");
                return [ minstr, maxstr ];
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var details;
                var _normalizePrepare = normalizePrepare(_get(_getPrototypeOf(MaskedRange.prototype), "doPrepare", this).call(this, ch.replace(/\D/g, ""), flags));
                var _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2);
                ch = _normalizePrepare2[0];
                details = _normalizePrepare2[1];
                if (!this.autofix || !ch) return ch;
                var fromStr = String(this.from).padStart(this.maxLength, "0");
                var toStr = String(this.to).padStart(this.maxLength, "0");
                var nextVal = this.value + ch;
                if (nextVal.length > this.maxLength) return "";
                var _this$boundaries = this.boundaries(nextVal), _this$boundaries2 = _slicedToArray(_this$boundaries, 2), minstr = _this$boundaries2[0], maxstr = _this$boundaries2[1];
                if (Number(maxstr) < this.from) return fromStr[nextVal.length - 1];
                if (Number(minstr) > this.to) {
                    if ("pad" === this.autofix && nextVal.length < this.maxLength) return [ "", details.aggregate(this.append(fromStr[nextVal.length - 1] + ch, flags)) ];
                    return toStr[nextVal.length - 1];
                }
                return ch;
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _get2;
                var str = this.value;
                var firstNonZero = str.search(/[^0]/);
                if (-1 === firstNonZero && str.length <= this._matchFrom) return true;
                var _this$boundaries3 = this.boundaries(str), _this$boundaries4 = _slicedToArray(_this$boundaries3, 2), minstr = _this$boundaries4[0], maxstr = _this$boundaries4[1];
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return this.from <= Number(maxstr) && Number(minstr) <= this.to && (_get2 = _get(_getPrototypeOf(MaskedRange.prototype), "doValidate", this)).call.apply(_get2, [ this ].concat(args));
            }
        } ]);
        return MaskedRange;
    }(MaskedPattern);
    IMask.MaskedRange = MaskedRange;
    var MaskedDate = function(_MaskedPattern) {
        _inherits(MaskedDate, _MaskedPattern);
        var _super = _createSuper(MaskedDate);
        function MaskedDate(opts) {
            _classCallCheck(this, MaskedDate);
            return _super.call(this, Object.assign({}, MaskedDate.DEFAULTS, opts));
        }
        _createClass(MaskedDate, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.mask === Date) delete opts.mask;
                if (opts.pattern) opts.mask = opts.pattern;
                var blocks = opts.blocks;
                opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
                if (opts.min) opts.blocks.Y.from = opts.min.getFullYear();
                if (opts.max) opts.blocks.Y.to = opts.max.getFullYear();
                if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
                    opts.blocks.m.from = opts.min.getMonth() + 1;
                    opts.blocks.m.to = opts.max.getMonth() + 1;
                    if (opts.blocks.m.from === opts.blocks.m.to) {
                        opts.blocks.d.from = opts.min.getDate();
                        opts.blocks.d.to = opts.max.getDate();
                    }
                }
                Object.assign(opts.blocks, this.blocks, blocks);
                Object.keys(opts.blocks).forEach((function(bk) {
                    var b = opts.blocks[bk];
                    if (!("autofix" in b) && "autofix" in opts) b.autofix = opts.autofix;
                }));
                _get(_getPrototypeOf(MaskedDate.prototype), "_update", this).call(this, opts);
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _get2;
                var date = this.date;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return (_get2 = _get(_getPrototypeOf(MaskedDate.prototype), "doValidate", this)).call.apply(_get2, [ this ].concat(args)) && (!this.isComplete || this.isDateExist(this.value) && null != date && (null == this.min || this.min <= date) && (null == this.max || date <= this.max));
            }
        }, {
            key: "isDateExist",
            value: function isDateExist(str) {
                return this.format(this.parse(str, this), this).indexOf(str) >= 0;
            }
        }, {
            key: "date",
            get: function get() {
                return this.typedValue;
            },
            set: function set(date) {
                this.typedValue = date;
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.isComplete ? _get(_getPrototypeOf(MaskedDate.prototype), "typedValue", this) : null;
            },
            set: function set(value) {
                _set(_getPrototypeOf(MaskedDate.prototype), "typedValue", value, this, true);
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                return mask === Date || _get(_getPrototypeOf(MaskedDate.prototype), "maskEquals", this).call(this, mask);
            }
        } ]);
        return MaskedDate;
    }(MaskedPattern);
    MaskedDate.DEFAULTS = {
        pattern: "d{.}`m{.}`Y",
        format: function format(date) {
            if (!date) return "";
            var day = String(date.getDate()).padStart(2, "0");
            var month = String(date.getMonth() + 1).padStart(2, "0");
            var year = date.getFullYear();
            return [ day, month, year ].join(".");
        },
        parse: function parse(str) {
            var _str$split = str.split("."), _str$split2 = _slicedToArray(_str$split, 3), day = _str$split2[0], month = _str$split2[1], year = _str$split2[2];
            return new Date(year, month - 1, day);
        }
    };
    MaskedDate.GET_DEFAULT_BLOCKS = function() {
        return {
            d: {
                mask: MaskedRange,
                from: 1,
                to: 31,
                maxLength: 2
            },
            m: {
                mask: MaskedRange,
                from: 1,
                to: 12,
                maxLength: 2
            },
            Y: {
                mask: MaskedRange,
                from: 1900,
                to: 9999
            }
        };
    };
    IMask.MaskedDate = MaskedDate;
    var MaskElement = function() {
        function MaskElement() {
            _classCallCheck(this, MaskElement);
        }
        _createClass(MaskElement, [ {
            key: "selectionStart",
            get: function get() {
                var start;
                try {
                    start = this._unsafeSelectionStart;
                } catch (e) {}
                return null != start ? start : this.value.length;
            }
        }, {
            key: "selectionEnd",
            get: function get() {
                var end;
                try {
                    end = this._unsafeSelectionEnd;
                } catch (e) {}
                return null != end ? end : this.value.length;
            }
        }, {
            key: "select",
            value: function select(start, end) {
                if (null == start || null == end || start === this.selectionStart && end === this.selectionEnd) return;
                try {
                    this._unsafeSelect(start, end);
                } catch (e) {}
            }
        }, {
            key: "_unsafeSelect",
            value: function _unsafeSelect(start, end) {}
        }, {
            key: "isActive",
            get: function get() {
                return false;
            }
        }, {
            key: "bindEvents",
            value: function bindEvents(handlers) {}
        }, {
            key: "unbindEvents",
            value: function unbindEvents() {}
        } ]);
        return MaskElement;
    }();
    IMask.MaskElement = MaskElement;
    var HTMLMaskElement = function(_MaskElement) {
        _inherits(HTMLMaskElement, _MaskElement);
        var _super = _createSuper(HTMLMaskElement);
        function HTMLMaskElement(input) {
            var _this;
            _classCallCheck(this, HTMLMaskElement);
            _this = _super.call(this);
            _this.input = input;
            _this._handlers = {};
            return _this;
        }
        _createClass(HTMLMaskElement, [ {
            key: "rootElement",
            get: function get() {
                var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
                return null !== (_this$input$getRootNo = null === (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) || void 0 === _this$input$getRootNo2 ? void 0 : _this$input$getRootNo2.call(_this$input)) && void 0 !== _this$input$getRootNo ? _this$input$getRootNo : document;
            }
        }, {
            key: "isActive",
            get: function get() {
                return this.input === this.rootElement.activeElement;
            }
        }, {
            key: "_unsafeSelectionStart",
            get: function get() {
                return this.input.selectionStart;
            }
        }, {
            key: "_unsafeSelectionEnd",
            get: function get() {
                return this.input.selectionEnd;
            }
        }, {
            key: "_unsafeSelect",
            value: function _unsafeSelect(start, end) {
                this.input.setSelectionRange(start, end);
            }
        }, {
            key: "value",
            get: function get() {
                return this.input.value;
            },
            set: function set(value) {
                this.input.value = value;
            }
        }, {
            key: "bindEvents",
            value: function bindEvents(handlers) {
                var _this2 = this;
                Object.keys(handlers).forEach((function(event) {
                    return _this2._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]);
                }));
            }
        }, {
            key: "unbindEvents",
            value: function unbindEvents() {
                var _this3 = this;
                Object.keys(this._handlers).forEach((function(event) {
                    return _this3._toggleEventHandler(event);
                }));
            }
        }, {
            key: "_toggleEventHandler",
            value: function _toggleEventHandler(event, handler) {
                if (this._handlers[event]) {
                    this.input.removeEventListener(event, this._handlers[event]);
                    delete this._handlers[event];
                }
                if (handler) {
                    this.input.addEventListener(event, handler);
                    this._handlers[event] = handler;
                }
            }
        } ]);
        return HTMLMaskElement;
    }(MaskElement);
    HTMLMaskElement.EVENTS_MAP = {
        selectionChange: "keydown",
        input: "input",
        drop: "drop",
        click: "click",
        focus: "focus",
        commit: "blur"
    };
    IMask.HTMLMaskElement = HTMLMaskElement;
    var HTMLContenteditableMaskElement = function(_HTMLMaskElement) {
        _inherits(HTMLContenteditableMaskElement, _HTMLMaskElement);
        var _super = _createSuper(HTMLContenteditableMaskElement);
        function HTMLContenteditableMaskElement() {
            _classCallCheck(this, HTMLContenteditableMaskElement);
            return _super.apply(this, arguments);
        }
        _createClass(HTMLContenteditableMaskElement, [ {
            key: "_unsafeSelectionStart",
            get: function get() {
                var root = this.rootElement;
                var selection = root.getSelection && root.getSelection();
                var anchorOffset = selection && selection.anchorOffset;
                var focusOffset = selection && selection.focusOffset;
                if (null == focusOffset || null == anchorOffset || anchorOffset < focusOffset) return anchorOffset;
                return focusOffset;
            }
        }, {
            key: "_unsafeSelectionEnd",
            get: function get() {
                var root = this.rootElement;
                var selection = root.getSelection && root.getSelection();
                var anchorOffset = selection && selection.anchorOffset;
                var focusOffset = selection && selection.focusOffset;
                if (null == focusOffset || null == anchorOffset || anchorOffset > focusOffset) return anchorOffset;
                return focusOffset;
            }
        }, {
            key: "_unsafeSelect",
            value: function _unsafeSelect(start, end) {
                if (!this.rootElement.createRange) return;
                var range = this.rootElement.createRange();
                range.setStart(this.input.firstChild || this.input, start);
                range.setEnd(this.input.lastChild || this.input, end);
                var root = this.rootElement;
                var selection = root.getSelection && root.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }, {
            key: "value",
            get: function get() {
                return this.input.textContent;
            },
            set: function set(value) {
                this.input.textContent = value;
            }
        } ]);
        return HTMLContenteditableMaskElement;
    }(HTMLMaskElement);
    IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    var input_excluded = [ "mask" ];
    var InputMask = function() {
        function InputMask(el, opts) {
            _classCallCheck(this, InputMask);
            this.el = el instanceof MaskElement ? el : el.isContentEditable && "INPUT" !== el.tagName && "TEXTAREA" !== el.tagName ? new HTMLContenteditableMaskElement(el) : new HTMLMaskElement(el);
            this.masked = createMask(opts);
            this._listeners = {};
            this._value = "";
            this._unmaskedValue = "";
            this._saveSelection = this._saveSelection.bind(this);
            this._onInput = this._onInput.bind(this);
            this._onChange = this._onChange.bind(this);
            this._onDrop = this._onDrop.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onClick = this._onClick.bind(this);
            this.alignCursor = this.alignCursor.bind(this);
            this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
            this._bindEvents();
            this.updateValue();
            this._onChange();
        }
        _createClass(InputMask, [ {
            key: "mask",
            get: function get() {
                return this.masked.mask;
            },
            set: function set(mask) {
                if (this.maskEquals(mask)) return;
                if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
                    this.masked.updateOptions({
                        mask
                    });
                    return;
                }
                var masked = createMask({
                    mask
                });
                masked.unmaskedValue = this.masked.unmaskedValue;
                this.masked = masked;
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                var _this$masked;
                return null == mask || (null === (_this$masked = this.masked) || void 0 === _this$masked ? void 0 : _this$masked.maskEquals(mask));
            }
        }, {
            key: "value",
            get: function get() {
                return this._value;
            },
            set: function set(str) {
                if (this.value === str) return;
                this.masked.value = str;
                this.updateControl();
                this.alignCursor();
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this._unmaskedValue;
            },
            set: function set(str) {
                if (this.unmaskedValue === str) return;
                this.masked.unmaskedValue = str;
                this.updateControl();
                this.alignCursor();
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.masked.typedValue;
            },
            set: function set(val) {
                if (this.masked.typedValueEquals(val)) return;
                this.masked.typedValue = val;
                this.updateControl();
                this.alignCursor();
            }
        }, {
            key: "_bindEvents",
            value: function _bindEvents() {
                this.el.bindEvents({
                    selectionChange: this._saveSelection,
                    input: this._onInput,
                    drop: this._onDrop,
                    click: this._onClick,
                    focus: this._onFocus,
                    commit: this._onChange
                });
            }
        }, {
            key: "_unbindEvents",
            value: function _unbindEvents() {
                if (this.el) this.el.unbindEvents();
            }
        }, {
            key: "_fireEvent",
            value: function _fireEvent(ev) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                var listeners = this._listeners[ev];
                if (!listeners) return;
                listeners.forEach((function(l) {
                    return l.apply(void 0, args);
                }));
            }
        }, {
            key: "selectionStart",
            get: function get() {
                return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
            }
        }, {
            key: "cursorPos",
            get: function get() {
                return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
            },
            set: function set(pos) {
                if (!this.el || !this.el.isActive) return;
                this.el.select(pos, pos);
                this._saveSelection();
            }
        }, {
            key: "_saveSelection",
            value: function _saveSelection() {
                if (this.value !== this.el.value) console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.");
                this._selection = {
                    start: this.selectionStart,
                    end: this.cursorPos
                };
            }
        }, {
            key: "updateValue",
            value: function updateValue() {
                this.masked.value = this.el.value;
                this._value = this.masked.value;
            }
        }, {
            key: "updateControl",
            value: function updateControl() {
                var newUnmaskedValue = this.masked.unmaskedValue;
                var newValue = this.masked.value;
                var isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
                this._unmaskedValue = newUnmaskedValue;
                this._value = newValue;
                if (this.el.value !== newValue) this.el.value = newValue;
                if (isChanged) this._fireChangeEvents();
            }
        }, {
            key: "updateOptions",
            value: function updateOptions(opts) {
                var mask = opts.mask, restOpts = _objectWithoutProperties(opts, input_excluded);
                var updateMask = !this.maskEquals(mask);
                var updateOpts = !objectIncludes(this.masked, restOpts);
                if (updateMask) this.mask = mask;
                if (updateOpts) this.masked.updateOptions(restOpts);
                if (updateMask || updateOpts) this.updateControl();
            }
        }, {
            key: "updateCursor",
            value: function updateCursor(cursorPos) {
                if (null == cursorPos) return;
                this.cursorPos = cursorPos;
                this._delayUpdateCursor(cursorPos);
            }
        }, {
            key: "_delayUpdateCursor",
            value: function _delayUpdateCursor(cursorPos) {
                var _this = this;
                this._abortUpdateCursor();
                this._changingCursorPos = cursorPos;
                this._cursorChanging = setTimeout((function() {
                    if (!_this.el) return;
                    _this.cursorPos = _this._changingCursorPos;
                    _this._abortUpdateCursor();
                }), 10);
            }
        }, {
            key: "_fireChangeEvents",
            value: function _fireChangeEvents() {
                this._fireEvent("accept", this._inputEvent);
                if (this.masked.isComplete) this._fireEvent("complete", this._inputEvent);
            }
        }, {
            key: "_abortUpdateCursor",
            value: function _abortUpdateCursor() {
                if (this._cursorChanging) {
                    clearTimeout(this._cursorChanging);
                    delete this._cursorChanging;
                }
            }
        }, {
            key: "alignCursor",
            value: function alignCursor() {
                this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
            }
        }, {
            key: "alignCursorFriendly",
            value: function alignCursorFriendly() {
                if (this.selectionStart !== this.cursorPos) return;
                this.alignCursor();
            }
        }, {
            key: "on",
            value: function on(ev, handler) {
                if (!this._listeners[ev]) this._listeners[ev] = [];
                this._listeners[ev].push(handler);
                return this;
            }
        }, {
            key: "off",
            value: function off(ev, handler) {
                if (!this._listeners[ev]) return this;
                if (!handler) {
                    delete this._listeners[ev];
                    return this;
                }
                var hIndex = this._listeners[ev].indexOf(handler);
                if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
                return this;
            }
        }, {
            key: "_onInput",
            value: function _onInput(e) {
                this._inputEvent = e;
                this._abortUpdateCursor();
                if (!this._selection) return this.updateValue();
                var details = new ActionDetails(this.el.value, this.cursorPos, this.value, this._selection);
                var oldRawValue = this.masked.rawInputValue;
                var offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
                    input: true,
                    raw: true
                }).offset;
                var removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
                var cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
                if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
                this.updateControl();
                this.updateCursor(cursorPos);
                delete this._inputEvent;
            }
        }, {
            key: "_onChange",
            value: function _onChange() {
                if (this.value !== this.el.value) this.updateValue();
                this.masked.doCommit();
                this.updateControl();
                this._saveSelection();
            }
        }, {
            key: "_onDrop",
            value: function _onDrop(ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
        }, {
            key: "_onFocus",
            value: function _onFocus(ev) {
                this.alignCursorFriendly();
            }
        }, {
            key: "_onClick",
            value: function _onClick(ev) {
                this.alignCursorFriendly();
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this._unbindEvents();
                this._listeners.length = 0;
                delete this.el;
            }
        } ]);
        return InputMask;
    }();
    IMask.InputMask = InputMask;
    var MaskedEnum = function(_MaskedPattern) {
        _inherits(MaskedEnum, _MaskedPattern);
        var _super = _createSuper(MaskedEnum);
        function MaskedEnum() {
            _classCallCheck(this, MaskedEnum);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedEnum, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.enum) opts.mask = "*".repeat(opts.enum[0].length);
                _get(_getPrototypeOf(MaskedEnum.prototype), "_update", this).call(this, opts);
            }
        }, {
            key: "doValidate",
            value: function doValidate() {
                var _get2, _this = this;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return this.enum.some((function(e) {
                    return e.indexOf(_this.unmaskedValue) >= 0;
                })) && (_get2 = _get(_getPrototypeOf(MaskedEnum.prototype), "doValidate", this)).call.apply(_get2, [ this ].concat(args));
            }
        } ]);
        return MaskedEnum;
    }(MaskedPattern);
    IMask.MaskedEnum = MaskedEnum;
    var MaskedNumber = function(_Masked) {
        _inherits(MaskedNumber, _Masked);
        var _super = _createSuper(MaskedNumber);
        function MaskedNumber(opts) {
            _classCallCheck(this, MaskedNumber);
            return _super.call(this, Object.assign({}, MaskedNumber.DEFAULTS, opts));
        }
        _createClass(MaskedNumber, [ {
            key: "_update",
            value: function _update(opts) {
                _get(_getPrototypeOf(MaskedNumber.prototype), "_update", this).call(this, opts);
                this._updateRegExps();
            }
        }, {
            key: "_updateRegExps",
            value: function _updateRegExps() {
                var start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
                var midInput = "(0|([1-9]+\\d*))?";
                var mid = "\\d*";
                var end = (this.scale ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
                this._numberRegExpInput = new RegExp(start + midInput + end);
                this._numberRegExp = new RegExp(start + mid + end);
                this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(escapeRegExp).join("") + "]", "g");
                this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), "g");
            }
        }, {
            key: "_removeThousandsSeparators",
            value: function _removeThousandsSeparators(value) {
                return value.replace(this._thousandsSeparatorRegExp, "");
            }
        }, {
            key: "_insertThousandsSeparators",
            value: function _insertThousandsSeparators(value) {
                var parts = value.split(this.radix);
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
                return parts.join(this.radix);
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(ch) {
                var _get2;
                ch = ch.replace(this._mapToRadixRegExp, this.radix);
                var noSepCh = this._removeThousandsSeparators(ch);
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
                var _normalizePrepare = normalizePrepare((_get2 = _get(_getPrototypeOf(MaskedNumber.prototype), "doPrepare", this)).call.apply(_get2, [ this, noSepCh ].concat(args))), _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2), prepCh = _normalizePrepare2[0], details = _normalizePrepare2[1];
                if (ch && !noSepCh) details.skip = true;
                return [ prepCh, details ];
            }
        }, {
            key: "_separatorsCount",
            value: function _separatorsCount(to) {
                var extendOnSeparators = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false;
                var count = 0;
                for (var pos = 0; pos < to; ++pos) if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
                    ++count;
                    if (extendOnSeparators) to += this.thousandsSeparator.length;
                }
                return count;
            }
        }, {
            key: "_separatorsCountFromSlice",
            value: function _separatorsCountFromSlice() {
                var slice = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._value;
                return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var flags = arguments.length > 2 ? arguments[2] : void 0;
                var _this$_adjustRangeWit = this._adjustRangeWithSeparators(fromPos, toPos);
                var _this$_adjustRangeWit2 = _slicedToArray(_this$_adjustRangeWit, 2);
                fromPos = _this$_adjustRangeWit2[0];
                toPos = _this$_adjustRangeWit2[1];
                return this._removeThousandsSeparators(_get(_getPrototypeOf(MaskedNumber.prototype), "extractInput", this).call(this, fromPos, toPos, flags));
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (!this.thousandsSeparator) return _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);
                var prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
                var prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
                this._value = this._removeThousandsSeparators(this.value);
                var appendDetails = _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);
                this._value = this._insertThousandsSeparators(this._value);
                var beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
                var beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
                appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
                appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
                return appendDetails;
            }
        }, {
            key: "_findSeparatorAround",
            value: function _findSeparatorAround(pos) {
                if (this.thousandsSeparator) {
                    var searchFrom = pos - this.thousandsSeparator.length + 1;
                    var separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
                    if (separatorPos <= pos) return separatorPos;
                }
                return -1;
            }
        }, {
            key: "_adjustRangeWithSeparators",
            value: function _adjustRangeWithSeparators(from, to) {
                var separatorAroundFromPos = this._findSeparatorAround(from);
                if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
                var separatorAroundToPos = this._findSeparatorAround(to);
                if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
                return [ from, to ];
            }
        }, {
            key: "remove",
            value: function remove() {
                var fromPos = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                var toPos = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.value.length;
                var _this$_adjustRangeWit3 = this._adjustRangeWithSeparators(fromPos, toPos);
                var _this$_adjustRangeWit4 = _slicedToArray(_this$_adjustRangeWit3, 2);
                fromPos = _this$_adjustRangeWit4[0];
                toPos = _this$_adjustRangeWit4[1];
                var valueBeforePos = this.value.slice(0, fromPos);
                var valueAfterPos = this.value.slice(toPos);
                var prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
                this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
                var beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
                return new ChangeDetails({
                    tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
                });
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos(cursorPos, direction) {
                if (!this.thousandsSeparator) return cursorPos;
                switch (direction) {
                  case DIRECTION.NONE:
                  case DIRECTION.LEFT:
                  case DIRECTION.FORCE_LEFT:
                    var separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
                    if (separatorAtLeftPos >= 0) {
                        var separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
                        if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) return separatorAtLeftPos;
                    }
                    break;

                  case DIRECTION.RIGHT:
                  case DIRECTION.FORCE_RIGHT:
                    var separatorAtRightPos = this._findSeparatorAround(cursorPos);
                    if (separatorAtRightPos >= 0) return separatorAtRightPos + this.thousandsSeparator.length;
                }
                return cursorPos;
            }
        }, {
            key: "doValidate",
            value: function doValidate(flags) {
                var regexp = flags.input ? this._numberRegExpInput : this._numberRegExp;
                var valid = regexp.test(this._removeThousandsSeparators(this.value));
                if (valid) {
                    var number = this.number;
                    valid = valid && !isNaN(number) && (null == this.min || this.min >= 0 || this.min <= this.number) && (null == this.max || this.max <= 0 || this.number <= this.max);
                }
                return valid && _get(_getPrototypeOf(MaskedNumber.prototype), "doValidate", this).call(this, flags);
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                if (this.value) {
                    var number = this.number;
                    var validnum = number;
                    if (null != this.min) validnum = Math.max(validnum, this.min);
                    if (null != this.max) validnum = Math.min(validnum, this.max);
                    if (validnum !== number) this.unmaskedValue = String(validnum);
                    var formatted = this.value;
                    if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
                    if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
                    this._value = formatted;
                }
                _get(_getPrototypeOf(MaskedNumber.prototype), "doCommit", this).call(this);
            }
        }, {
            key: "_normalizeZeros",
            value: function _normalizeZeros(value) {
                var parts = this._removeThousandsSeparators(value).split(this.radix);
                parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (function(match, sign, zeros, num) {
                    return sign + num;
                }));
                if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + "0";
                if (parts.length > 1) {
                    parts[1] = parts[1].replace(/0*$/, "");
                    if (!parts[1].length) parts.length = 1;
                }
                return this._insertThousandsSeparators(parts.join(this.radix));
            }
        }, {
            key: "_padFractionalZeros",
            value: function _padFractionalZeros(value) {
                if (!value) return value;
                var parts = value.split(this.radix);
                if (parts.length < 2) parts.push("");
                parts[1] = parts[1].padEnd(this.scale, "0");
                return parts.join(this.radix);
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, ".");
            },
            set: function set(unmaskedValue) {
                _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", unmaskedValue.replace(".", this.radix), this, true);
            }
        }, {
            key: "typedValue",
            get: function get() {
                return Number(this.unmaskedValue);
            },
            set: function set(n) {
                _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", String(n), this, true);
            }
        }, {
            key: "number",
            get: function get() {
                return this.typedValue;
            },
            set: function set(number) {
                this.typedValue = number;
            }
        }, {
            key: "allowNegative",
            get: function get() {
                return this.signed || null != this.min && this.min < 0 || null != this.max && this.max < 0;
            }
        }, {
            key: "typedValueEquals",
            value: function typedValueEquals(value) {
                return (_get(_getPrototypeOf(MaskedNumber.prototype), "typedValueEquals", this).call(this, value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(0 === value && "" === this.value);
            }
        } ]);
        return MaskedNumber;
    }(Masked);
    MaskedNumber.DEFAULTS = {
        radix: ",",
        thousandsSeparator: "",
        mapToRadix: [ "." ],
        scale: 2,
        signed: false,
        normalizeZeros: true,
        padFractionalZeros: false
    };
    MaskedNumber.EMPTY_VALUES = [].concat(_toConsumableArray(Masked.EMPTY_VALUES), [ 0 ]);
    IMask.MaskedNumber = MaskedNumber;
    var MaskedFunction = function(_Masked) {
        _inherits(MaskedFunction, _Masked);
        var _super = _createSuper(MaskedFunction);
        function MaskedFunction() {
            _classCallCheck(this, MaskedFunction);
            return _super.apply(this, arguments);
        }
        _createClass(MaskedFunction, [ {
            key: "_update",
            value: function _update(opts) {
                if (opts.mask) opts.validate = opts.mask;
                _get(_getPrototypeOf(MaskedFunction.prototype), "_update", this).call(this, opts);
            }
        } ]);
        return MaskedFunction;
    }(Masked);
    IMask.MaskedFunction = MaskedFunction;
    var dynamic_excluded = [ "compiledMasks", "currentMaskRef", "currentMask" ];
    var MaskedDynamic = function(_Masked) {
        _inherits(MaskedDynamic, _Masked);
        var _super = _createSuper(MaskedDynamic);
        function MaskedDynamic(opts) {
            var _this;
            _classCallCheck(this, MaskedDynamic);
            _this = _super.call(this, Object.assign({}, MaskedDynamic.DEFAULTS, opts));
            _this.currentMask = null;
            return _this;
        }
        _createClass(MaskedDynamic, [ {
            key: "_update",
            value: function _update(opts) {
                _get(_getPrototypeOf(MaskedDynamic.prototype), "_update", this).call(this, opts);
                if ("mask" in opts) this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map((function(m) {
                    return createMask(m);
                })) : [];
            }
        }, {
            key: "_appendCharRaw",
            value: function _appendCharRaw(ch) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var details = this._applyDispatch(ch, flags);
                if (this.currentMask) details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
                return details;
            }
        }, {
            key: "_applyDispatch",
            value: function _applyDispatch() {
                var appended = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var prevValueBeforeTail = flags.tail && null != flags._beforeTailState ? flags._beforeTailState._value : this.value;
                var inputValue = this.rawInputValue;
                var insertValue = flags.tail && null != flags._beforeTailState ? flags._beforeTailState._rawInputValue : inputValue;
                var tailValue = inputValue.slice(insertValue.length);
                var prevMask = this.currentMask;
                var details = new ChangeDetails;
                var prevMaskState = null === prevMask || void 0 === prevMask ? void 0 : prevMask.state;
                this.currentMask = this.doDispatch(appended, Object.assign({}, flags));
                if (this.currentMask) if (this.currentMask !== prevMask) {
                    this.currentMask.reset();
                    if (insertValue) {
                        var d = this.currentMask.append(insertValue, {
                            raw: true
                        });
                        details.tailShift = d.inserted.length - prevValueBeforeTail.length;
                    }
                    if (tailValue) details.tailShift += this.currentMask.append(tailValue, {
                        raw: true,
                        tail: true
                    }).tailShift;
                } else this.currentMask.state = prevMaskState;
                return details;
            }
        }, {
            key: "_appendPlaceholder",
            value: function _appendPlaceholder() {
                var details = this._applyDispatch.apply(this, arguments);
                if (this.currentMask) details.aggregate(this.currentMask._appendPlaceholder());
                return details;
            }
        }, {
            key: "_appendEager",
            value: function _appendEager() {
                var details = this._applyDispatch.apply(this, arguments);
                if (this.currentMask) details.aggregate(this.currentMask._appendEager());
                return details;
            }
        }, {
            key: "currentMaskFlags",
            value: function currentMaskFlags(flags) {
                var _flags$_beforeTailSta, _flags$_beforeTailSta2;
                return Object.assign({}, flags, {
                    _beforeTailState: (null === (_flags$_beforeTailSta = flags._beforeTailState) || void 0 === _flags$_beforeTailSta ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && (null === (_flags$_beforeTailSta2 = flags._beforeTailState) || void 0 === _flags$_beforeTailSta2 ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
                });
            }
        }, {
            key: "doDispatch",
            value: function doDispatch(appended) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return this.dispatch(appended, this, flags);
            }
        }, {
            key: "doValidate",
            value: function doValidate(flags) {
                return _get(_getPrototypeOf(MaskedDynamic.prototype), "doValidate", this).call(this, flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
            }
        }, {
            key: "doPrepare",
            value: function doPrepare(str) {
                var flags = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                var _normalizePrepare = normalizePrepare(_get(_getPrototypeOf(MaskedDynamic.prototype), "doPrepare", this).call(this, str, flags)), _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2), s = _normalizePrepare2[0], details = _normalizePrepare2[1];
                if (this.currentMask) {
                    var currentDetails;
                    var _normalizePrepare3 = normalizePrepare(_get(_getPrototypeOf(MaskedDynamic.prototype), "doPrepare", this).call(this, s, this.currentMaskFlags(flags)));
                    var _normalizePrepare4 = _slicedToArray(_normalizePrepare3, 2);
                    s = _normalizePrepare4[0];
                    currentDetails = _normalizePrepare4[1];
                    details = details.aggregate(currentDetails);
                }
                return [ s, details ];
            }
        }, {
            key: "reset",
            value: function reset() {
                var _this$currentMask;
                null === (_this$currentMask = this.currentMask) || void 0 === _this$currentMask ? void 0 : _this$currentMask.reset();
                this.compiledMasks.forEach((function(m) {
                    return m.reset();
                }));
            }
        }, {
            key: "value",
            get: function get() {
                return this.currentMask ? this.currentMask.value : "";
            },
            set: function set(value) {
                _set(_getPrototypeOf(MaskedDynamic.prototype), "value", value, this, true);
            }
        }, {
            key: "unmaskedValue",
            get: function get() {
                return this.currentMask ? this.currentMask.unmaskedValue : "";
            },
            set: function set(unmaskedValue) {
                _set(_getPrototypeOf(MaskedDynamic.prototype), "unmaskedValue", unmaskedValue, this, true);
            }
        }, {
            key: "typedValue",
            get: function get() {
                return this.currentMask ? this.currentMask.typedValue : "";
            },
            set: function set(value) {
                var unmaskedValue = String(value);
                if (this.currentMask) {
                    this.currentMask.typedValue = value;
                    unmaskedValue = this.currentMask.unmaskedValue;
                }
                this.unmaskedValue = unmaskedValue;
            }
        }, {
            key: "isComplete",
            get: function get() {
                var _this$currentMask2;
                return Boolean(null === (_this$currentMask2 = this.currentMask) || void 0 === _this$currentMask2 ? void 0 : _this$currentMask2.isComplete);
            }
        }, {
            key: "isFilled",
            get: function get() {
                var _this$currentMask3;
                return Boolean(null === (_this$currentMask3 = this.currentMask) || void 0 === _this$currentMask3 ? void 0 : _this$currentMask3.isFilled);
            }
        }, {
            key: "remove",
            value: function remove() {
                var details = new ChangeDetails;
                if (this.currentMask) {
                    var _this$currentMask4;
                    details.aggregate((_this$currentMask4 = this.currentMask).remove.apply(_this$currentMask4, arguments)).aggregate(this._applyDispatch());
                }
                return details;
            }
        }, {
            key: "state",
            get: function get() {
                var _this$currentMask5;
                return Object.assign({}, _get(_getPrototypeOf(MaskedDynamic.prototype), "state", this), {
                    _rawInputValue: this.rawInputValue,
                    compiledMasks: this.compiledMasks.map((function(m) {
                        return m.state;
                    })),
                    currentMaskRef: this.currentMask,
                    currentMask: null === (_this$currentMask5 = this.currentMask) || void 0 === _this$currentMask5 ? void 0 : _this$currentMask5.state
                });
            },
            set: function set(state) {
                var compiledMasks = state.compiledMasks, currentMaskRef = state.currentMaskRef, currentMask = state.currentMask, maskedState = _objectWithoutProperties(state, dynamic_excluded);
                this.compiledMasks.forEach((function(m, mi) {
                    return m.state = compiledMasks[mi];
                }));
                if (null != currentMaskRef) {
                    this.currentMask = currentMaskRef;
                    this.currentMask.state = currentMask;
                }
                _set(_getPrototypeOf(MaskedDynamic.prototype), "state", maskedState, this, true);
            }
        }, {
            key: "extractInput",
            value: function extractInput() {
                var _this$currentMask6;
                return this.currentMask ? (_this$currentMask6 = this.currentMask).extractInput.apply(_this$currentMask6, arguments) : "";
            }
        }, {
            key: "extractTail",
            value: function extractTail() {
                var _this$currentMask7, _get2;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return this.currentMask ? (_this$currentMask7 = this.currentMask).extractTail.apply(_this$currentMask7, args) : (_get2 = _get(_getPrototypeOf(MaskedDynamic.prototype), "extractTail", this)).call.apply(_get2, [ this ].concat(args));
            }
        }, {
            key: "doCommit",
            value: function doCommit() {
                if (this.currentMask) this.currentMask.doCommit();
                _get(_getPrototypeOf(MaskedDynamic.prototype), "doCommit", this).call(this);
            }
        }, {
            key: "nearestInputPos",
            value: function nearestInputPos() {
                var _this$currentMask8, _get3;
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                return this.currentMask ? (_this$currentMask8 = this.currentMask).nearestInputPos.apply(_this$currentMask8, args) : (_get3 = _get(_getPrototypeOf(MaskedDynamic.prototype), "nearestInputPos", this)).call.apply(_get3, [ this ].concat(args));
            }
        }, {
            key: "overwrite",
            get: function get() {
                return this.currentMask ? this.currentMask.overwrite : _get(_getPrototypeOf(MaskedDynamic.prototype), "overwrite", this);
            },
            set: function set(overwrite) {
                console.warn('"overwrite" option is not available in dynamic mask, use this option in siblings');
            }
        }, {
            key: "eager",
            get: function get() {
                return this.currentMask ? this.currentMask.eager : _get(_getPrototypeOf(MaskedDynamic.prototype), "eager", this);
            },
            set: function set(eager) {
                console.warn('"eager" option is not available in dynamic mask, use this option in siblings');
            }
        }, {
            key: "maskEquals",
            value: function maskEquals(mask) {
                return Array.isArray(mask) && this.compiledMasks.every((function(m, mi) {
                    var _mask$mi;
                    return m.maskEquals(null === (_mask$mi = mask[mi]) || void 0 === _mask$mi ? void 0 : _mask$mi.mask);
                }));
            }
        }, {
            key: "typedValueEquals",
            value: function typedValueEquals(value) {
                var _this$currentMask9;
                return Boolean(null === (_this$currentMask9 = this.currentMask) || void 0 === _this$currentMask9 ? void 0 : _this$currentMask9.typedValueEquals(value));
            }
        } ]);
        return MaskedDynamic;
    }(Masked);
    MaskedDynamic.DEFAULTS = {
        dispatch: function dispatch(appended, masked, flags) {
            if (!masked.compiledMasks.length) return;
            var inputValue = masked.rawInputValue;
            var inputs = masked.compiledMasks.map((function(m, index) {
                m.reset();
                m.append(inputValue, {
                    raw: true
                });
                m.append(appended, masked.currentMaskFlags(flags));
                var weight = m.rawInputValue.length;
                return {
                    weight,
                    index
                };
            }));
            inputs.sort((function(i1, i2) {
                return i2.weight - i1.weight;
            }));
            return masked.compiledMasks[inputs[0].index];
        }
    };
    IMask.MaskedDynamic = MaskedDynamic;
    var PIPE_TYPE = {
        MASKED: "value",
        UNMASKED: "unmaskedValue",
        TYPED: "typedValue"
    };
    function createPipe(mask) {
        var from = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : PIPE_TYPE.MASKED;
        var to = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : PIPE_TYPE.MASKED;
        var masked = createMask(mask);
        return function(value) {
            return masked.runIsolated((function(m) {
                m[from] = value;
                return m[to];
            }));
        };
    }
    function pipe(value) {
        for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) pipeArgs[_key - 1] = arguments[_key];
        return createPipe.apply(void 0, pipeArgs)(value);
    }
    IMask.PIPE_TYPE = PIPE_TYPE;
    IMask.createPipe = createPipe;
    IMask.pipe = pipe;
    try {
        globalThis.IMask = IMask;
    } catch (e) {}
    let phone = document.getElementById("phone");
    let phoneCalc = document.getElementById("phone-number");
    let maskOptions = {
        mask: "+{38} (000) 000-00-00"
    };
    if (phone) {
        IMask(phone, maskOptions);
    }
    if (phoneCalc) {
        IMask(phoneCalc, maskOptions);
    }
    const singleButton = document.getElementById("option1");
    const doubleButton = document.getElementById("option2");
    const childButton = document.getElementById("option3");
    const eliteButton = document.getElementById("option4");
    const warriorButton = document.getElementById("option5");
    const accessoryButton = document.getElementById("option6");
    const europButton = document.getElementById("option7");
    const cardElements = document.querySelectorAll(".katalog__img");
    const availableCheckbox = document.getElementById("available");
    const thredCheckbox = document.getElementById("thre-d");
    const graniteChecbox = document.getElementById("granite");
    const marbleChecbox = document.getElementById("marble");
    const label = document.querySelector(".katalog__checkbox-text");
    const filterDrop = document.querySelector(".katalog__filterdrop");
    if (singleButton) singleButton.addEventListener("change", handleCategoryChange);
    if (doubleButton) doubleButton.addEventListener("change", handleCategoryChange);
    if (childButton) childButton.addEventListener("change", handleCategoryChange);
    if (eliteButton) eliteButton.addEventListener("change", handleCategoryChange);
    if (warriorButton) warriorButton.addEventListener("change", handleCategoryChange);
    if (accessoryButton) accessoryButton.addEventListener("change", handleCategoryChange);
    if (europButton) europButton.addEventListener("change", handleCategoryChange);
    if (availableCheckbox) availableCheckbox.addEventListener("change", handleTypeChange);
    if (thredCheckbox) thredCheckbox.addEventListener("change", handleTypeDChange);
    if (graniteChecbox) graniteChecbox.addEventListener("change", handleGraniteChange);
    if (marbleChecbox) marbleChecbox.addEventListener("change", handleMarbleChange);
    if (window.onload) showMore();
    function handleCategoryChange(event) {
        showMore();
        const selectedCategory = event.target.value;
        cardElements.forEach((cardElement => {
            showMore();
            availableCheckbox.checked = false;
            thredCheckbox.checked = false;
            graniteChecbox.checked = false;
            marbleChecbox.checked = false;
            cardElement.classList.remove("katalog__img-hiden-price");
            cardElement.classList.remove("katalog__img-hiden-marble");
            cardElement.classList.remove("katalog__img-hiden-granite");
            cardElement.classList.remove("katalog__img-hiden-3d");
            cardElement.classList.remove("katalog__img-hiden-available");
            if (cardElement.classList.contains(selectedCategory)) cardElement.classList.remove("katalog__img-hiden"); else cardElement.classList.add("katalog__img-hiden");
        }));
    }
    function handleTypeChange(event) {
        const selectedType = event.target.value;
        cardElements.forEach((cardElement => {
            showMore();
            if (this.checked) {
                label.classList.add("selected");
                if (!cardElement.classList.contains("katalog__img-hiden")) if (cardElement.classList.contains(selectedType)) cardElement.classList.remove("katalog__img-hiden-available"); else cardElement.classList.add("katalog__img-hiden-available");
            } else {
                label.classList.remove("selected");
                cardElement.classList.remove("katalog__img-hiden-available");
            }
        }));
    }
    function handleTypeDChange(event) {
        const selectedType = event.target.value;
        cardElements.forEach((cardElement => {
            showMore();
            if (this.checked) {
                label.classList.add("selected");
                if (!cardElement.classList.contains("katalog__img-hiden")) if (cardElement.classList.contains(selectedType)) cardElement.classList.remove("katalog__img-hiden-3d"); else cardElement.classList.add("katalog__img-hiden-3d");
            } else {
                label.classList.remove("selected");
                cardElement.classList.remove("katalog__img-hiden-3d");
            }
        }));
    }
    function handleGraniteChange(event) {
        const selectedType = event.target.value;
        cardElements.forEach((cardElement => {
            showMore();
            if (this.checked) {
                label.classList.add("selected");
                if (!cardElement.classList.contains("katalog__img-hiden")) if (cardElement.classList.contains(selectedType)) cardElement.classList.remove("katalog__img-hiden-granite"); else cardElement.classList.add("katalog__img-hiden-granite");
            } else {
                label.classList.remove("selected");
                cardElement.classList.remove("katalog__img-hiden-granite");
            }
        }));
    }
    function handleMarbleChange(event) {
        const selectedType = event.target.value;
        cardElements.forEach((cardElement => {
            showMore();
            if (this.checked) {
                label.classList.add("selected");
                if (!cardElement.classList.contains("katalog__img-hiden")) if (cardElement.classList.contains(selectedType)) cardElement.classList.remove("katalog__img-hiden-marble"); else cardElement.classList.add("katalog__img-hiden-marble");
            } else {
                label.classList.remove("selected");
                cardElement.classList.remove("katalog__img-hiden-marble");
            }
        }));
    }
    const slider1 = document.querySelector(".slider1");
    const slider2 = document.querySelector(".slider2");
    const value1 = document.querySelector(".value1");
    const value2 = document.querySelector(".value2");
    if (slider1) {
        slider1.defaultValue;
        value1.textContent;
    }
    if (slider2) {
        slider2.defaultValue;
        value2.textContent;
    }
    if (slider1) slider1.addEventListener("input", (function() {
        value1.textContent = this.value + " UAH";
        filterCards();
    }));
    if (slider2) slider2.addEventListener("input", (function() {
        value2.textContent = this.value + " UAH";
        filterCards();
    }));
    function filterCards() {
        showMore();
        const minPrice = parseInt(slider1.value);
        const maxPrice = parseInt(slider2.value);
        cardElements.forEach((function(cardElements) {
            const price = parseInt(cardElements.getAttribute("data-price"));
            if (price >= minPrice && price <= maxPrice) cardElements.classList.remove("katalog__img-hiden-price"); else cardElements.classList.add("katalog__img-hiden-price");
        }));
    }
    if (filterDrop) filterDrop.addEventListener("click", (() => {
        availableCheckbox.checked = false;
        thredCheckbox.checked = false;
        graniteChecbox.checked = false;
        marbleChecbox.checked = false;
        slider1.value = defaultSlider1Value;
        slider2.value = defaultSlider2Value;
        value1.textContent = defaultSliderValue1;
        value2.textContent = defaultSliderValue2;
        cardElements.forEach((cardElement => {
            cardElement.classList.remove("katalog__img-hiden-price");
            cardElement.classList.remove("katalog__img-hiden-marble");
            cardElement.classList.remove("katalog__img-hiden-granite");
            cardElement.classList.remove("katalog__img-hiden-3d");
            cardElement.classList.remove("katalog__img-hiden-available");
        }));
    }));
    const priceList1 = document.querySelector(".thred__price-list1");
    const priceList2 = document.querySelector(".thred__price-list2");
    const priceList3 = document.querySelector(".thred__price-list3");
    function priseListFunc(price) {
        if (price) {
            const links = price.querySelectorAll(".thred__price-link");
            links.forEach((link => {
                link.addEventListener("click", (e => {
                    e.preventDefault();
                    const activeLink = price.querySelector(".active");
                    if (activeLink) activeLink.classList.remove("active");
                    link.classList.add("active");
                }));
            }));
        }
    }
    priseListFunc(priceList1);
    priseListFunc(priceList2);
    priseListFunc(priceList3);
    if (document.querySelector(".thred__slider")) {
        const thredSwiper = new core(".thred__slider", {
            modules: [ Navigation ],
            observer: true,
            observeParents: true,
            slidesPerView: 3,
            lazy: true,
            spaceBetween: 30,
            speed: 800,
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 15
                },
                500: {
                    slidesPerView: 2,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1268: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            on: {}
        });
        const slides = document.querySelectorAll(".thred__slide");
        if (slides) {
            const slides = document.querySelectorAll(".thred__slide");
            const singleMonumentSlides = [];
            const doubleMonumentSlides = [];
            const childMonumentSlides = [];
            slides.forEach((slide => {
                const price = parseInt(slide.dataset.price);
                const imageUrl = slide.querySelector("img").getAttribute("src");
                const slideObj = {
                    price,
                    imageUrl
                };
                if (slide.classList.contains("single-monument")) singleMonumentSlides.push(slideObj); else if (slide.classList.contains("double-monument")) doubleMonumentSlides.push(slideObj); else if (slide.classList.contains("child-monument")) childMonumentSlides.push(slideObj);
            }));
            console.log(singleMonumentSlides);
            console.log(doubleMonumentSlides);
            console.log(childMonumentSlides);
            function createProducts(filterElement) {
                let slideContainer = document.querySelector(".thred__wrapper");
                filterElement.forEach((product => {
                    const slide = document.createElement("div");
                    slide.classList.add("swiper-slide");
                    slide.classList.add("thred__slide");
                    const image = document.createElement("img");
                    image.src = product.imageUrl;
                    slide.appendChild(image);
                    const hover = document.createElement("p");
                    const button = document.createElement("a");
                    button.href = "goods.html";
                    button.classList.add("main-button");
                    const textNode = document.createTextNode("дивитися більше");
                    button.appendChild(textNode);
                    slide.appendChild(hover);
                    hover.appendChild(button);
                    slideContainer.appendChild(slide);
                }));
            }
            function createSlidesOne(minPrice, maxPrice) {
                let slideContainer = document.querySelector(".thred__wrapper");
                slideContainer.innerHTML = "";
                const filteredProductsOne = singleMonumentSlides.filter((product => product.price >= minPrice && product.price <= maxPrice));
                createProducts(filteredProductsOne);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }
            function createSlidesTwo(minPrice, maxPrice) {
                let slideContainer = document.querySelector(".thred__wrapper");
                slideContainer.innerHTML = "";
                const filteredProductsTwo = doubleMonumentSlides.filter((product => product.price >= minPrice && product.price <= maxPrice));
                createProducts(filteredProductsTwo);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }
            function createSlidesChild(minPrice, maxPrice) {
                let slideContainer = document.querySelector(".thred__wrapper");
                slideContainer.innerHTML = "";
                const filteredProductsChild = childMonumentSlides.filter((product => product.price >= minPrice && product.price <= maxPrice));
                createProducts(filteredProductsChild);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }
            const button20to30 = document.querySelector("#btn-20-30");
            if (button20to30) button20to30.addEventListener("click", (() => {
                createSlidesOne(2e4, 3e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const button30to50 = document.querySelector("#btn-30-50");
            if (button30to50) button30to50.addEventListener("click", (() => {
                createSlidesOne(3e4, 5e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const button50to80 = document.querySelector("#btn-50-80");
            if (button50to80) button50to80.addEventListener("click", (() => {
                createSlidesOne(5e4, 8e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const button80plus = document.querySelector("#btn-80-plus");
            if (button80plus) button80plus.addEventListener("click", (() => {
                createSlidesOne(8e4, 1 / 0);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonTwo20to30 = document.querySelector("#btnTwo-20-30");
            if (buttonTwo20to30) buttonTwo20to30.addEventListener("click", (() => {
                createSlidesTwo(2e4, 3e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonTwo30to50 = document.querySelector("#btnTwo-30-50");
            if (buttonTwo30to50) buttonTwo30to50.addEventListener("click", (() => {
                createSlidesTwo(3e4, 5e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonTwo50to80 = document.querySelector("#btnTwo-50-80");
            if (buttonTwo50to80) buttonTwo50to80.addEventListener("click", (() => {
                createSlidesTwo(5e4, 8e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonTwo80plus = document.querySelector("#btnTwo-80-plus");
            if (buttonTwo80plus) buttonTwo80plus.addEventListener("click", (() => {
                createSlidesTwo(8e4, 1 / 0);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonChild20to30 = document.querySelector("#btnChild-20-30");
            if (buttonChild20to30) buttonChild20to30.addEventListener("click", (() => {
                createSlidesChild(2e4, 3e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonChild30to50 = document.querySelector("#btnChild-30-50");
            if (buttonChild30to50) buttonChild30to50.addEventListener("click", (() => {
                createSlidesChild(3e4, 5e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonChild50to80 = document.querySelector("#btnChild-50-80");
            if (buttonChild50to80) buttonChild50to80.addEventListener("click", (() => {
                createSlidesChild(5e4, 8e4);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
            const buttonChild80plus = document.querySelector("#btnChild-80-plus");
            if (buttonChild80plus) buttonChild80plus.addEventListener("click", (() => {
                createSlidesChild(8e4, 1 / 0);
                thredSwiper.update();
                thredSwiper.loopCreate();
                thredSwiper.slideTo(0);
            }));
        }
    }
    document.querySelector(".calc__progress-bar-body");
    const progressBar = document.querySelector(".calc__progress-bar");
    const questionScreens = document.querySelectorAll(".calc__question-screen");
    const nextButtons = document.querySelectorAll(".calc__next-btn");
    const backButtons = document.querySelectorAll(".calc__back-btn");
    document.querySelector(".calc__question-screen-end");
    let currentScreen = 0;
    document.querySelector(".informations__form-body");
    document.getElementById("phone-number");
    const popup = document.querySelector(".popup");
    if (popup) {
        function updateProgressBar() {
            const percent = (currentScreen + 1) / questionScreens.length * 100;
            progressBar.style.width = `${percent}%`;
        }
        function showScreen(index) {
            questionScreens[currentScreen].classList.remove("active");
            questionScreens[index].classList.add("active");
            currentScreen = index;
            updateProgressBar();
        }
        nextButtons.forEach(((button, index) => {
            button.addEventListener("click", (() => {
                if (currentScreen < questionScreens.length - 1) showScreen(currentScreen + 1);
            }));
        }));
        backButtons.forEach(((button, index) => {
            button.addEventListener("click", (() => {
                if (currentScreen > 0) showScreen(currentScreen - 1);
            }));
        }));
        updateProgressBar();
        showScreen(0);
        const checkboxYes = document.getElementById("delivery-yes");
        const checkboxNo = document.getElementById("delivery-no");
        const hidenBody = document.querySelector(".delivery__hiden-body");
        if (checkboxYes) checkboxYes.addEventListener("change", handleYesChange);
        if (checkboxNo) checkboxNo.addEventListener("change", handleYesChange);
        function handleYesChange(event) {
            const checked = event.target.value;
            if ("tak" === checked) hidenBody.classList.remove("delivery__body-hiden"); else hidenBody.classList.add("delivery__body-hiden");
        }
    }
    window["FLS"] = true;
    menuInit();
    spollers();
    showMore();
    formSubmit();
    pageNavigation();
})();
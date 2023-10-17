import { debounce, throttle } from 'throttle-debounce';
import { scrollbarWidth } from './scrollbarWidth';
import { canUseDOM } from './common';
import { classNamesToQuery } from './class';

import type { Axis, AxisProps, Options, ClassNames } from '../types';

export class ScrollbarCore {
  el: HTMLElement;
  options: Options;
  classNames: ClassNames;
  axis: Record<Axis, AxisProps>;

  wrapperEl: HTMLElement | null = null;
  contentWrapperEl: HTMLElement | null = null;
  contentEl: HTMLElement | null = null;

  offsetEl: HTMLElement | null = null;
  maskEl: HTMLElement | null = null;
  placeholderEl: HTMLElement | null = null;
  heightAutoObserverWrapperEl: HTMLElement | null = null;
  heightAutoObserverEl: HTMLElement | null = null;
  scrollbarWidth: number = 0;

  mouseX: number = 0;
  mouseY: number = 0;

  onMouseMove: throttle<any> | (() => void) = () => {};
  onWindowResize: debounce<any> | (() => void) = () => {};

  static defaultOptions: Options = {
    forceVisible: false,
    clickOnTrack: true,
    scrollbarMinSize: 25,
    scrollbarMaxSize: 0,
    ariaLabel: 'scrollable content',
    classNames: {
      contentEl: 'simplebar-content',
      contentWrapper: 'simplebar-content-wrapper',
      offset: 'simplebar-offset',
      mask: 'simplebar-mask',
      wrapper: 'simplebar-wrapper',
      placeholder: 'simplebar-placeholder',
      scrollbar: 'simplebar-scrollbar',
      track: 'simplebar-track',
      heightAutoObserverWrapperEl: 'simplebar-height-auto-observer-wrapper',
      heightAutoObserverEl: 'simplebar-height-auto-observer',
      visible: 'simplebar-visible',
      horizontal: 'simplebar-horizontal',
      vertical: 'simplebar-vertical',
      hover: 'simplebar-hover',
      dragging: 'simplebar-dragging',
      scrolling: 'simplebar-scrolling',
      scrollable: 'simplebar-scrollable',
      mouseEntered: 'simplebar-mouse-entered',
    },
    scrollableNode: null,
    contentNode: null,
    autoHide: true,
  }

  constructor(element: HTMLElement, options: Partial<Options> = {}) {
    this.el = element;
    this.options = { ...ScrollbarCore.defaultOptions, ...options };
    this.classNames = {
      ...ScrollbarCore.defaultOptions.classNames,
      ...options.classNames,
    } as ClassNames;

    this.axis = {
      x: {
        scrollOffsetAttr: 'scrollLeft',
        sizeAttr: 'width',
        scrollSizeAttr: 'scrollWidth',
        offsetSizeAttr: 'offsetWidth',
        offsetAttr: 'left',
        overflowAttr: 'overflowX',
        dragOffset: 0,
        isOverflowing: true,
        forceVisible: false,
        track: { size: null, el: null, rect: null, isVisible: false },
        scrollbar: { size: null, el: null, rect: null, isVisible: false },
      },
      y: {
        scrollOffsetAttr: 'scrollTop',
        sizeAttr: 'height',
        scrollSizeAttr: 'scrollHeight',
        offsetSizeAttr: 'offsetHeight',
        offsetAttr: 'top',
        overflowAttr: 'overflowY',
        dragOffset: 0,
        isOverflowing: true,
        forceVisible: false,
        track: { size: null, el: null, rect: null, isVisible: false },
        scrollbar: { size: null, el: null, rect: null, isVisible: false },
      }
    }

    this.onMouseMove = throttle(64, this._onMouseMove);
    this.onWindowResize = debounce(64, this._onWindowResize);

    this.init();
  }

  getScrollbarWidth() {
    try {
      if (
        (this.contentWrapperEl &&
        getComputedStyle(this.contentWrapperEl, '::-webkit-scrollbar').display === 'none') ||
        'scrollbarWidth' in document.documentElement.style ||
        '-ms-overflow-style' in document.documentElement.style
      ) {
        return 0;
      } else {
        return scrollbarWidth();
      }
    } catch (error) {
      return scrollbarWidth();
    }
  }

  init() {
    if (canUseDOM) {
      this.initDOM();

      this.scrollbarWidth = this.getScrollbarWidth();

      this.initListeners();
    }
  }

  initDOM() {
    this.wrapperEl = this.el.querySelector(
      classNamesToQuery(this.classNames.wrapper)
    );
    this.contentWrapperEl =
      this.options.scrollableNode ||
      this.el.querySelector(classNamesToQuery(this.classNames.contentWrapper));
    this.contentEl =
      this.options.contentNode ||
      this.el.querySelector(classNamesToQuery(this.classNames.contentEl));

    this.offsetEl = this.el.querySelector(
      classNamesToQuery(this.classNames.offset)
    );
    this.maskEl = this.el.querySelector(
      classNamesToQuery(this.classNames.mask)
    );

    this.placeholderEl = this.findChild(
      this.wrapperEl,
      classNamesToQuery(this.classNames.placeholder)
    );
    this.heightAutoObserverWrapperEl = this.el.querySelector(
      classNamesToQuery(this.classNames.heightAutoObserverWrapperEl)
    );
    this.heightAutoObserverEl = this.el.querySelector(
      classNamesToQuery(this.classNames.heightAutoObserverEl)
    );

    this.axis.x.track.el = this.findChild(
      this.el,
      `${classNamesToQuery(this.classNames.track)}${classNamesToQuery(
        this.classNames.horizontal
      )}`
    );
    this.axis.y.track.el = this.findChild(
      this.el,
      `${classNamesToQuery(this.classNames.track)}${classNamesToQuery(
        this.classNames.vertical
      )}`
    );
  }

  initListeners() {

  }

  findChild(el: any, query: any) {
    const matches =
      el.matches ||
      el.webkitMatchesSelector ||
      el.mozMatchesSelector ||
      el.msMatchesSelector;
    return Array.prototype.filter.call(el.children, (child) =>
      matches.call(child, query)
    )[0];
  }

  _onMouseMove = (e: any) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (this.axis.x.isOverflowing || this.axis.x.forceVisible) {
      this.onMouseMoveForAxis('x');
    }

    if (this.axis.y.isOverflowing || this.axis.y.forceVisible) {
      this.onMouseMoveForAxis('y');
    }
  };

  onMouseMoveForAxis(axis: Axis = 'y') {
    const currentAxis = this.axis[axis];
    if (!currentAxis.track.el || !currentAxis.scrollbar.el) return;
  }

  _onWindowResize = () => {
    // Recalculate scrollbarWidth in case it's a zoom
    this.scrollbarWidth = this.getScrollbarWidth();
  }
}

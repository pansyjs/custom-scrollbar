import { debounce, throttle } from 'throttle-debounce';
import { scrollbarWidth } from './scrollbarWidth';
import { canUseDOM, getElementWindow } from './common';
import { classNamesToQuery, addClasses, removeClasses, } from './class';

import type { Axis, AxisProps, Options, ClassNames } from '../types';

type RtlHelpers = {
  isScrollOriginAtZero: boolean;
  isScrollingToNegative: boolean;
} | null;

export class ScrollbarCore {
  el: HTMLElement;
  options: Options;
  classNames: ClassNames;
  axis: Record<Axis, AxisProps>;

  minScrollbarWidth = 20;
  stopScrollDelay = 175;
  isScrolling = false;
  isMouseEntering = false;
  scrollXTicking = false;
  scrollYTicking = false;

  wrapperEl: HTMLElement | null = null;
  contentWrapperEl: HTMLElement | null = null;
  contentEl: HTMLElement | null = null;

  offsetEl: HTMLElement | null = null;
  maskEl: HTMLElement | null = null;
  placeholderEl: HTMLElement | null = null;
  heightAutoObserverWrapperEl: HTMLElement | null = null;
  heightAutoObserverEl: HTMLElement | null = null;
  scrollbarWidth: number = 0;
  elStyles: CSSStyleDeclaration | null = null;
  isRtl: boolean | null = null;

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
    const elWindow = getElementWindow(this.el);

    this.el.addEventListener('mouseenter', this.onMouseEnter);
    this.el.addEventListener('pointerdown', this.onPointerEvent, true);

    this.el.addEventListener('mousemove', this.onMouseMove);
    this.el.addEventListener('mouseleave', this.onMouseLeave);

    this.contentWrapperEl?.addEventListener('scroll', this.onScroll);
  }

  removeListeners() {

  }

  onScroll = () => {
    const elWindow = getElementWindow(this.el);

    if (!this.scrollXTicking) {
      elWindow.requestAnimationFrame(this.scrollX);
      this.scrollXTicking = true;
    }
  }

  scrollX = () => {
    if (this.axis.x.isOverflowing) {
      this.positionScrollbar('x');
    }

    this.scrollXTicking = false;
  };

  positionScrollbar(axis: Axis = 'y') {
    const scrollbar = this.axis[axis].scrollbar;

    if (
      !this.axis[axis].isOverflowing ||
      !this.contentWrapperEl ||
      !scrollbar.el ||
      !this.elStyles
    ) {
      return;
    }

    const contentSize = this.contentWrapperEl[this.axis[axis].scrollSizeAttr];

    const trackSize =
      this.axis[axis].track.el?.[this.axis[axis].offsetSizeAttr] || 0;
    const hostSize = parseInt(this.elStyles[this.axis[axis].sizeAttr], 10);

    let scrollOffset = this.contentWrapperEl[this.axis[axis].scrollOffsetAttr];

    scrollOffset =
      axis === 'x' &&
      this.isRtl &&
      ScrollbarCore.getRtlHelpers()?.isScrollOriginAtZero
        ? -scrollOffset
        : scrollOffset;

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

  _onMouseMove = (e: MouseEvent) => {
    console.log(e);
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

    currentAxis.track.rect = currentAxis.track.el.getBoundingClientRect();
    currentAxis.scrollbar.rect =
      currentAxis.scrollbar.el.getBoundingClientRect();

    if (this.isWithinBounds(currentAxis.track.rect)) {
      this.showScrollbar(axis);
      addClasses(currentAxis.track.el, this.classNames.hover);

      if (this.isWithinBounds(currentAxis.scrollbar.rect)) {
        addClasses(currentAxis.scrollbar.el, this.classNames.hover);
      } else {
        removeClasses(currentAxis.scrollbar.el, this.classNames.hover);
      }
    } else {
      removeClasses(currentAxis.track.el, this.classNames.hover);
      if (this.options.autoHide) {
        this.hideScrollbar(axis);
      }
    }
  }

  _onWindowResize = () => {
    // Recalculate scrollbarWidth in case it's a zoom
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  onMouseEnter = () => {
    if (!this.isMouseEntering) {
      addClasses(this.el, this.classNames.mouseEntered);

      this.showScrollbar('x');
      this.showScrollbar('y');

      this.isMouseEntering = true;
    }
  }

  onMouseLeave = () => {
    (this.onMouseMove as debounce<any>).cancel();

    if (this.axis.x.isOverflowing || this.axis.x.forceVisible) {
      this.onMouseLeaveForAxis('x');
    }

    if (this.axis.y.isOverflowing || this.axis.y.forceVisible) {
      this.onMouseLeaveForAxis('y');
    }

    this.mouseX = -1;
    this.mouseY = -1;
  };

  onMouseLeaveForAxis(axis: Axis = 'y') {
    removeClasses(this.axis[axis].track.el, this.classNames.hover);
    removeClasses(this.axis[axis].scrollbar.el, this.classNames.hover);
    if (this.options.autoHide) {
      this.hideScrollbar(axis);
    }
  }

  onPointerEvent = () => {

  }

  showScrollbar(axis: Axis = 'y') {
    if (this.axis[axis].isOverflowing && !this.axis[axis].scrollbar.isVisible) {
      addClasses(this.axis[axis].scrollbar.el, this.classNames.visible);
      this.axis[axis].scrollbar.isVisible = true;
    }
  }

  hideScrollbar(axis: Axis = 'y') {
    if (this.axis[axis].isOverflowing && this.axis[axis].scrollbar.isVisible) {
      removeClasses(this.axis[axis].scrollbar.el, this.classNames.visible);
      this.axis[axis].scrollbar.isVisible = false;
    }
  }

  isWithinBounds(bbox: DOMRect) {
    return (
      this.mouseX >= bbox.left &&
      this.mouseX <= bbox.left + bbox.width &&
      this.mouseY >= bbox.top &&
      this.mouseY <= bbox.top + bbox.height
    );
  }

  unMount() {
    this.removeListeners();
  }

  static rtlHelpers: RtlHelpers = null;
  static getRtlHelpers() {
    if (ScrollbarCore.rtlHelpers) {
      return ScrollbarCore.rtlHelpers;
    }

    const dummyDiv = document.createElement('div');
    dummyDiv.innerHTML =
      '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';

    const scrollbarDummyEl = dummyDiv.firstElementChild;
    const dummyChild = scrollbarDummyEl?.firstElementChild;

    if (!dummyChild) return null;

    document.body.appendChild(scrollbarDummyEl);

    scrollbarDummyEl.scrollLeft = 0;
  }
}

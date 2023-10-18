export type Axis = 'x' | 'y';

export type AxisProps = {
  scrollOffsetAttr: 'scrollLeft' | 'scrollTop';
  sizeAttr: 'width' | 'height';
  scrollSizeAttr: 'scrollWidth' | 'scrollHeight';
  offsetSizeAttr: 'offsetWidth' | 'offsetHeight';
  offsetAttr: 'left' | 'top';
  overflowAttr: 'overflowX' | 'overflowY';
  dragOffset: number;
  isOverflowing: boolean;
  forceVisible: boolean;
  track: {
    size: any;
    el: HTMLElement | null;
    rect: DOMRect | null;
    isVisible: boolean;
  };
  scrollbar: {
    size: any;
    el: HTMLElement | null;
    rect: DOMRect | null;
    isVisible: boolean;
  };
}

export type ClassNames = {
  contentEl: string;
  contentWrapper: string;
  offset: string;
  mask: string;
  wrapper: string;
  placeholder: string;
  scrollbar: string;
  track: string;
  heightAutoObserverWrapperEl: string;
  heightAutoObserverEl: string;
  visible: string;
  horizontal: string;
  vertical: string;
  hover: string;
  dragging: string;
  scrolling: string;
  scrollable: string;
  mouseEntered: string;
};

export interface Options {
  forceVisible: boolean | Axis;
  clickOnTrack: boolean;
  scrollbarMinSize: number;
  scrollbarMaxSize: number;
  classNames: Partial<ClassNames>;
  ariaLabel: string;
  scrollableNode: HTMLElement | null;
  contentNode: HTMLElement | null;
  autoHide: boolean;
}

export interface ScrollbarOptions extends Partial<Options> {}

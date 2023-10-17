import React, { forwardRef, useEffect, useRef } from 'react';
import { ScrollbarCore } from './helpers';

import type { ScrollbarOptions } from './types';

export interface ScrollbarProps extends
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
  ScrollbarOptions
{
  children?: React.ReactNode;
  scrollableNodeProps?: {
    ref?: any;
    className?: string;
    [key: string]: any;
  };
}

const InternalScrollbar: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ScrollbarProps
> = (props, ref) => {
  const { children, scrollableNodeProps = {}, ...otherProps } = props;
  const elRef = useRef<HTMLDivElement>(null);
  const scrollableNodeRef = React.useRef<HTMLDivElement>(null);
  const contentNodeRef = React.useRef<HTMLElement>();
  const options: Partial<ScrollbarOptions> = {};
  const rest: Record<string, any> = {};

  Object.keys(otherProps).forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(ScrollbarCore.defaultOptions, key)
    ) {
      (options as any)[key] = otherProps[key as keyof ScrollbarOptions];
    } else {
      rest[key] = otherProps[key as keyof ScrollbarOptions];
    }
  });

  const classNames = {
    ...ScrollbarCore.defaultOptions.classNames,
    ...options.classNames,
  } as Required<(typeof ScrollbarCore.defaultOptions)['classNames']>;

  const scrollableNodeFullProps = {
    ...scrollableNodeProps,
    className: `${classNames.contentWrapper}${
      scrollableNodeProps.className ? ` ${scrollableNodeProps.className}` : ''
    }`,
    tabIndex: 0,
    role: 'region',
    'aria-label': options.ariaLabel || ScrollbarCore.defaultOptions.ariaLabel,
  }

  useEffect(
    () => {
      let instance: ScrollbarCore | null;
      scrollableNodeRef.current = scrollableNodeFullProps.ref
        ? scrollableNodeFullProps.ref.current
        : scrollableNodeRef.current;

      if (elRef.current) {
        instance = new ScrollbarCore(elRef.current, {
          ...options,
          ...(scrollableNodeRef.current && {
            scrollableNode: scrollableNodeRef.current,
          }),
          ...(contentNodeRef.current && {
            contentNode: contentNodeRef.current,
          }),
        });
      }
    },
    []
  )

  return (
    <div data-simplebar="init" ref={elRef} {...rest}>
      <div className={classNames.wrapper}>
        <div className={classNames.heightAutoObserverWrapperEl}>
          <div className={classNames.heightAutoObserverEl} />
        </div>
        <div className={classNames.mask}>
          <div className={classNames.offset}>
            <div {...scrollableNodeFullProps}>
              <div className={classNames.contentEl}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${classNames.track} simplebar-horizontal`}>
        <div className={classNames.scrollbar} />
      </div>
      <div className={`${classNames.track} simplebar-vertical`}>
        <div className={classNames.scrollbar} />
      </div>
    </div>
  );
}

export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(InternalScrollbar);

import React, { useRef, useEffect, forwardRef } from 'react';
import ScrollbarCore from './scrollbar';
import type { SimpleBarOptions } from 'simplebar-core';

type RenderFunc = (props: {
  scrollableNodeRef: React.MutableRefObject<HTMLElement | undefined>;
  scrollableNodeProps: {
    className: string;
    ref: React.MutableRefObject<HTMLElement | undefined>;
  };
  contentNodeRef: React.MutableRefObject<HTMLElement | undefined>;
  contentNodeProps: {
    className: string;
    ref: React.MutableRefObject<HTMLElement | undefined>;
  };
}) => React.ReactNode;

export interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    SimpleBarOptions {
  children?: React.ReactNode | RenderFunc;
  scrollableNodeProps?: {
    ref?: any;
    className?: string;
    [key: string]: any;
  };
}

export const Scrollbar = forwardRef<ScrollbarCore | null, Props>(
  ({ children, scrollableNodeProps = {}, ...otherProps }, ref) => {
    const elRef = useRef();
    const scrollableNodeRef = useRef<HTMLElement>();
    const contentNodeRef = useRef<HTMLElement>();
    const options: Partial<SimpleBarOptions> = {};
    const rest: any = {};

    Object.keys(otherProps).forEach((key) => {
      if (
        Object.prototype.hasOwnProperty.call(ScrollbarCore.defaultOptions, key)
      ) {
        (options as any)[key] = otherProps[key as keyof SimpleBarOptions];
      } else {
        rest[key] = otherProps[key as keyof SimpleBarOptions];
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
    };

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

          if (typeof ref === 'function') {
            ref(instance);
          } else if (ref) {
            ref.current = instance;
          }
        }

        return () => {
          instance?.unMount();
          instance = null;
          if (typeof ref === 'function') {
            ref(null);
          }
        };
      },
      []
    );

    return (
      <div data-simplebar="init" ref={elRef} {...rest}>
        <div className={classNames.wrapper}>
          <div className={classNames.heightAutoObserverWrapperEl}>
            <div className={classNames.heightAutoObserverEl} />
          </div>
          <div className={classNames.mask}>
            <div className={classNames.offset}>
              {typeof children === 'function' ? (
                children({
                  scrollableNodeRef,
                  scrollableNodeProps: {
                    ...scrollableNodeFullProps,
                    ref: scrollableNodeRef,
                  },
                  contentNodeRef,
                  contentNodeProps: {
                    className: classNames.contentEl,
                    ref: contentNodeRef,
                  },
                })
              ) : (
                <div {...scrollableNodeFullProps}>
                  <div className={classNames.contentEl}>{children}</div>
                </div>
              )}
            </div>
          </div>
          <div className={classNames.placeholder} />
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
);

export default Scrollbar;

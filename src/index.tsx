import React, { useRef, useEffect, forwardRef } from 'react';
import { classNames } from '@pansy/shared';
import CustomScrollbarCore from './CustomScrollbar';

import type { CustomScrollbarOptions } from './types';

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

export interface CustomScrollbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    CustomScrollbarOptions {
  prefixCls?: string;
  children?: React.ReactNode | RenderFunc;
  dark?: boolean;
  size?: 'middle' | 'small';
  scrollableNodeProps?: {
    ref?: any;
    className?: string;
    [key: string]: any;
  };
}

export const CustomScrollbar = forwardRef<CustomScrollbarCore | null, CustomScrollbarProps>((props, ref) => {
  const {
    prefixCls = 'custom-scrollbar',
    className,
    children,
    scrollableNodeProps = {},
    dark = false,
    size = 'middle',
    ...otherProps
  } = props;
  const elRef = useRef();
  const scrollableNodeRef = useRef<HTMLElement>();
  const contentNodeRef = useRef<HTMLElement>();
  const options: Partial<CustomScrollbarOptions> = {};
  const rest: Record<string, any> = {};

  Object.keys(otherProps).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(CustomScrollbarCore.defaultOptions, key)) {
      (options as any)[key] = otherProps[key as keyof CustomScrollbarOptions];
    } else {
      rest[key] = otherProps[key as keyof CustomScrollbarOptions];
    }
  });

  const classes = {
    ...CustomScrollbarCore.defaultOptions.classNames,
    ...options.classNames,
  } as Required<(typeof CustomScrollbarCore.defaultOptions)['classNames']>;

  const scrollableNodeFullProps = {
    ...scrollableNodeProps,
    className: `${classes.contentWrapper}${scrollableNodeProps.className ? ` ${scrollableNodeProps.className}` : ''}`,
    tabIndex: 0,
    role: 'region',
    'aria-label': options.ariaLabel || CustomScrollbarCore.defaultOptions.ariaLabel,
  };

  useEffect(() => {
    CustomScrollbarCore.prefixCls = prefixCls;
    let instance: CustomScrollbarCore | null;
    scrollableNodeRef.current = scrollableNodeFullProps.ref
      ? scrollableNodeFullProps.ref.current
      : scrollableNodeRef.current;

    if (elRef.current) {
      instance = new CustomScrollbarCore(elRef.current, {
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
  }, []);

  return (
    <div
      data-simplebar="init"
      ref={elRef}
      {...rest}
      className={classNames(className, {
        [`${prefixCls}-dark`]: dark,
        [`${prefixCls}-sm`]: size === 'small',
      })}
    >
      <div className={classes.wrapper}>
        <div className={classes.heightAutoObserverWrapperEl}>
          <div className={classes.heightAutoObserverEl} />
        </div>
        <div className={classes.mask}>
          <div className={classes.offset}>
            {typeof children === 'function' ? (
              children({
                scrollableNodeRef,
                scrollableNodeProps: {
                  ...scrollableNodeFullProps,
                  ref: scrollableNodeRef,
                },
                contentNodeRef,
                contentNodeProps: {
                  className: classes.contentEl,
                  ref: contentNodeRef,
                },
              })
            ) : (
              <div {...scrollableNodeFullProps}>
                <div className={classes.contentEl}>{children}</div>
              </div>
            )}
          </div>
        </div>
        <div className={classes.placeholder} />
      </div>
      <div className={`${classes.track} ${prefixCls}-horizontal`}>
        <div className={classes.scrollbar} />
      </div>
      <div className={`${classes.track} ${prefixCls}-vertical`}>
        <div className={classes.scrollbar} />
      </div>
    </div>
  );
});

export default CustomScrollbar;

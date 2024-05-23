import { useEffect, useRef, useState } from 'react';
import Scrollbar from '@pansy/custom-scrollbar-react';

export const List = () => {
  const rootRef = useRef<any>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (rootRef.current?.el) {
      const targetElement = rootRef.current.el.parentNode;

      if (targetElement) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            console.log('元素的高度发生了变化:', entry.contentRect.height);
            setHeight(entry.contentRect.height);
          }
        });

        resizeObserver.observe(targetElement);
      }
    }
  }, []);

  return (
    <Scrollbar
      style={{
        maxHeight: height ? height : '100%',
        width: '100%',
      }}
      ref={rootRef}
      autoHide={false}
    >
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位1</p>
      <p>信息占位100</p>
    </Scrollbar>
  );
};

import React from 'react';
import CustomScrollbar from '@pansy/custom-scrollbar-react';
import '../../scrollbar.less';

export default () => {
  return (
    <CustomScrollbar
      style={{
        maxHeight: 300,
      }}
    >
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
    </CustomScrollbar>
  );
};

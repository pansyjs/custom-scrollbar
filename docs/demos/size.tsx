import React from 'react';
import { Space } from 'antd';
import CustomScrollbar from '@pansy/custom-scrollbar-react';
import '../../scrollbar.less';

export default () => {
  return (
    <Space>
      <CustomScrollbar
        style={{
          maxHeight: 300,
          width: 200
        }}
        autoHide={false}
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
      <CustomScrollbar
        style={{
          maxHeight: 300,
          width: 200
        }}
        size="small"
        autoHide={false}
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
    </Space>
  )
}

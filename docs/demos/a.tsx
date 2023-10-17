import React from 'react';
import { Scrollbar } from '@pansy/scrollbar-react';
import './simplebar.css';

export default () => {
  return (
    <Scrollbar style={{ height: 200 }}>
      <p>123</p>
      <p>124</p>
      <p>125</p>
      <p>126</p>
      <p>127</p>
      <p>128</p>
    </Scrollbar>
  )
}

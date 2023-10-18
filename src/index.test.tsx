import React from 'react';
import { CustomScrollbar } from './';
import { render, waitFor } from '@testing-library/react';

test('renders without crashing', () => {
  const { container } = render(
    <div>
      <CustomScrollbar>
        {[...Array(5)].map((_, i) => (
          <p key={i}>Some content</p>
        ))}
      </CustomScrollbar>
    </div>
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('renders with options', () => {
  const { container } = render(
    <CustomScrollbar forceVisible="y">
      {[...Array(5)].map((x, i) => (
        <p key={i}>Some content</p>
      ))}
    </CustomScrollbar>
  );
  expect(container.firstChild).toMatchSnapshot();

  expect(
    container.querySelector('.custom-scrollbar-track.custom-scrollbar-vertical')
  ).toBeVisible();
});

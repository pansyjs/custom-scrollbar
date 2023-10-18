import React from 'react';
import { CustomScrollbar } from '../src';
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

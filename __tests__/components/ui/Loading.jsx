import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Loading from '../../../@core/components/ui/Loading';

describe('Loading', () => {
  it('renders a spinner with a "loading" text', () => {
    const { baseElement } = render(<Loading />);

    expect(baseElement.innerHTML).toContain('<div role="status" class="spinner-border">');
    expect(baseElement).toHaveTextContent('Loading...');
  })
});

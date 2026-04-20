import {render, screen} from '@testing-library/react';
import {ThemeToggle} from '@/components/ThemeToggle';

jest.mock('next-themes', () => ({
  useTheme: () => ({theme: 'dark', setTheme: jest.fn()}),
}));

describe('ThemeToggle', () => {
  it('renders a button with aria-label', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', {name: /toggle theme/i})).toBeInTheDocument();
  });
});
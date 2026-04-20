import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ThemeToggle} from '@/components/ThemeToggle';

const setTheme = jest.fn();
const useThemeMock = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => useThemeMock(),
}));

beforeEach(() => {
  setTheme.mockClear();
  useThemeMock.mockReturnValue({resolvedTheme: 'dark', setTheme});
});

describe('ThemeToggle', () => {
  it('renders the sun icon when resolved theme is dark', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('☀')).toBeInTheDocument();
  });

  it('calls setTheme("light") when clicked in dark mode', async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button'));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme("dark") when clicked in light mode', async () => {
    useThemeMock.mockReturnValue({resolvedTheme: 'light', setTheme});
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button'));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
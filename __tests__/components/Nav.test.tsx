import {render, screen} from '@testing-library/react';
import {Nav} from '@/components/Nav';

const mockPathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => null,
}));

jest.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => null,
}));

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy({}, {
      get(_: unknown, tag: string) {
        return ({children, initial: _i, animate: _a, transition: _t, ...props}: {children?: React.ReactNode; initial?: unknown; animate?: unknown; transition?: unknown} & React.HTMLAttributes<HTMLElement>) =>
          React.createElement(tag, props, children);
      },
    }),
  };
});

beforeEach(() => {
  mockPathname.mockReturnValue('/en-GB');
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  }));
});

describe('Nav active dot', () => {
  it('shows dot on the blog link when on the blog page', () => {
    mockPathname.mockReturnValue('/en-GB/blog');
    render(<Nav locale="en-GB" />);
    const blogLink = screen.getByRole('link', {name: 'blog'});
    const dot = blogLink.querySelector('span');
    expect(dot).toHaveClass('opacity-100');
  });

  it('shows dot on the books link when on the books page', () => {
    mockPathname.mockReturnValue('/en-GB/books');
    render(<Nav locale="en-GB" />);
    const booksLink = screen.getByRole('link', {name: 'books'});
    const dot = booksLink.querySelector('span');
    expect(dot).toHaveClass('opacity-100');
  });

  it('hides dot on the blog link when on the home page', () => {
    mockPathname.mockReturnValue('/en-GB');
    render(<Nav locale="en-GB" />);
    const blogLink = screen.getByRole('link', {name: 'blog'});
    const dot = blogLink.querySelector('span');
    expect(dot).toHaveClass('opacity-0');
  });

  it('hides dot on the books link when viewing the blog', () => {
    mockPathname.mockReturnValue('/en-GB/blog');
    render(<Nav locale="en-GB" />);
    const booksLink = screen.getByRole('link', {name: 'books'});
    const dot = booksLink.querySelector('span');
    expect(dot).toHaveClass('opacity-0');
  });

  it('renders the contact nav link', () => {
    mockPathname.mockReturnValue('/en-GB');
    render(<Nav locale="en-GB" />);
    expect(screen.getByRole('link', {name: 'contact'})).toBeInTheDocument();
  });
});

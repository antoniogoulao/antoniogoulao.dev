import {render, fireEvent} from '@testing-library/react';
import {Hero} from '@/components/home/Hero';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({children, href, ...props}: {children: React.ReactNode; href: string} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
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

describe('Hero gradient', () => {
  it('applies a radial-gradient to the section background on render', () => {
    const {container} = render(<Hero locale="en-GB" />);
    const section = container.querySelector('#about')!;
    expect(section.getAttribute('style')).toContain('radial-gradient');
  });

  it('updates the gradient position on mouse move', () => {
    const {container} = render(<Hero locale="en-GB" />);
    const section = container.querySelector('#about')! as HTMLElement;

    jest.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 1000, height: 500,
      right: 1000, bottom: 500, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);

    fireEvent.mouseMove(section, {clientX: 500, clientY: 250});

    expect(section.getAttribute('style')).toContain('50.0% 50.0%');
  });

  it('resets to the default position on mouse leave', () => {
    const {container} = render(<Hero locale="en-GB" />);
    const section = container.querySelector('#about')! as HTMLElement;

    jest.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 1000, height: 500,
      right: 1000, bottom: 500, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);

    fireEvent.mouseMove(section, {clientX: 500, clientY: 250});
    fireEvent.mouseLeave(section);

    expect(section.getAttribute('style')).toContain('85.0% 10.0%');
  });
});
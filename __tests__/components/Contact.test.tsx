import {render, screen, fireEvent} from '@testing-library/react';
import {Contact} from '@/components/home/Contact';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/components/SectionDivider', () => ({
  SectionDivider: ({label}: {label: string}) => <div data-testid="section-divider">{label}</div>,
}));

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: {href: ''},
  });
});

describe('Contact form', () => {
  it('renders all form fields and the send button', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('namePlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('emailPlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('messagePlaceholder')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'send'})).toBeInTheDocument();
  });

  it('builds a mailto URL with URL-encoded field values on submit', () => {
    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), {
      target: {value: 'Test User'},
    });
    fireEvent.change(screen.getByPlaceholderText('emailPlaceholder'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('messagePlaceholder'), {
      target: {value: 'Hello world'},
    });

    fireEvent.click(screen.getByRole('button', {name: 'send'}));

    expect(window.location.href).toContain('mailto:antoniomgoulao@protonmail.com');
    expect(window.location.href).toContain('Test%20User');
    expect(window.location.href).toContain('test%40example.com');
    expect(window.location.href).toContain('Hello%20world');
  });

  it('does not navigate when fields are empty', () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', {name: 'send'}));
    expect(window.location.href).toBe('');
  });
});

import {render, screen} from '@testing-library/react';
import {Contact, contactMailto} from '@/components/home/Contact';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/components/SectionDivider', () => ({
  SectionDivider: ({label}: {label: string}) => <div data-testid="section-divider">{label}</div>,
}));

describe('Contact form', () => {
  it('renders all form fields and the send button', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('namePlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('emailPlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('messagePlaceholder')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'send'})).toBeInTheDocument();
  });

  it('builds a mailto URL with URL-encoded field values', () => {
    const href = contactMailto('Test User', 'test@example.com', 'Hello world');
    expect(href).toContain('mailto:antoniomgoulao@gmail.com');
    expect(href).toContain('Test%20User');
    expect(href).toContain('test%40example.com');
    expect(href).toContain('Hello%20world');
  });

  it('returns null when any field is empty', () => {
    expect(contactMailto('', 'test@example.com', 'Hello')).toBeNull();
    expect(contactMailto('Test', '', 'Hello')).toBeNull();
    expect(contactMailto('Test', 'test@example.com', '')).toBeNull();
  });
});

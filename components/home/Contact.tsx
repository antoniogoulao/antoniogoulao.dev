'use client';
import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {SectionDivider} from '@/components/SectionDivider';

export function contactMailto(name: string, email: string, message: string): string | null {
  if (!name || !email || !message) return null;
  const subject = encodeURIComponent(`Message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  return `mailto:antoniomgoulao@gmail.com?subject=${subject}&body=${body}`;
}

export function Contact() {
  const t = useTranslations('contact');
  const ts = useTranslations('sections');
  const th = useTranslations('hero');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const href = contactMailto(name, email, message);
    if (href) window.location.href = href;
  }

  return (
    <section id="contact" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={ts('contact')} />
      <p className="text-muted text-sm leading-relaxed mb-4 max-w-md font-sans">
        {t('intro')}
      </p>
      <p className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-sans">
        <a href="mailto:antoniomgoulao@gmail.com" className="text-primary hover:underline">
          antoniomgoulao@gmail.com
        </a>
        <a href="/CV_Antonio_Goulao_FE.pdf" download className="text-muted hover:text-foreground transition-colors">
          {th('downloadCv')}
        </a>
        <a
          href="https://github.com/antoniogoulao"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/antoniomgoulao/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-muted font-sans">
              {t('name')}
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="bg-surface border border-surface rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted font-sans focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className="text-xs uppercase tracking-widest text-muted font-sans">
              {t('email')}
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-surface border border-surface rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted font-sans focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mb-6">
          <label htmlFor="contact-message" className="text-xs uppercase tracking-widest text-muted font-sans">
            {t('message')}
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder={t('messagePlaceholder')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="bg-surface border border-surface rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted font-sans focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary text-background text-xs font-bold uppercase tracking-wide rounded hover:bg-primary/90 transition-colors font-sans"
        >
          {t('send')}
        </button>
      </form>
    </section>
  );
}

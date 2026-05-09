'use client';
import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {SectionDivider} from '@/components/SectionDivider';

export function Contact() {
  const t = useTranslations('contact');
  const ts = useTranslations('sections');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:antoniomgoulao@protonmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={ts('contact')} />
      <p className="text-muted text-sm leading-relaxed mb-8 max-w-md font-sans">
        {t('intro')}
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

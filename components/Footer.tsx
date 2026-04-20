export function Footer() {
  return (
    <footer className="border-t border-surface mt-24">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} António Goulão
        </p>

        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://github.com/antoniogoulao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/antoniogoulao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://bsky.app/profile/antoniogoulao.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            Bluesky
          </a>
          <a
            href="https://rideandlisten.antoniogoulao.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 border border-primary text-primary text-xs rounded hover:bg-primary hover:text-background transition-colors"
          >
            Ride & Listen ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
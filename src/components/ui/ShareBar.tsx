"use client";

type ShareBarProps = {
  url: string;
  title: string;
};

type ShareItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4H16V5.3c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.2V11H9v2.8h2.4V21h2.1Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M18.9 3H21l-4.6 5.3L22 21h-4.8l-3.8-5.5L8.6 21H6.5l5-5.7L2 3h4.9l3.5 5 4.5-5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M6.9 8.5H3.7V20h3.2V8.5ZM5.3 3C4.2 3 3.4 3.8 3.4 4.8s.8 1.8 1.9 1.8c1 0 1.8-.8 1.8-1.8S6.3 3 5.3 3ZM20.6 13c0-3.1-1.7-4.6-4-4.6-1.8 0-2.7 1-3.1 1.7V8.5h-3.2c0 1 .1 11.5 0 11.5h3.2v-6.4c0-.3 0-.7.1-.9.2-.7.8-1.4 1.8-1.4 1.3 0 1.9 1 1.9 2.5V20H21v-7Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M20.7 4.3 3.7 10.9c-1.2.5-1.2 1.1-.2 1.4l4.4 1.4 1.7 5.2c.2.6.1.8.8.8.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.5.3 1.8-.8L23 5.9c.4-1.3-.5-1.8-1.3-1.6ZM9 13.4l9-5.7c.4-.2.7-.1.4.2l-7.3 6.6-.3 3.2L9 13.4Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M20 11.9A8 8 0 0 0 6.4 6.3a7.9 7.9 0 0 0-1.3 8.8L4 20l5-1.3a8 8 0 0 0 3 .6h.1a8 8 0 0 0 7.9-7.4Zm-8 6a6.5 6.5 0 0 1-2.8-.6l-.2-.1-3 .8.8-2.9-.2-.3a6.5 6.5 0 1 1 5.4 3.1Zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.4.6c-.1.2-.3.2-.5.1a5.3 5.3 0 0 1-1.5-.9 5.8 5.8 0 0 1-1.1-1.4c-.1-.2 0-.3.1-.4l.3-.4.2-.3c.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.3-.3-.5-.3h-.4c-.1 0-.4 0-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.5 2.3 3.7 3.2.5.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export function ShareBar({ url, title }: ShareBarProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const items: ShareItem[] = [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <XIcon />,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedInIcon />,
    },
    {
      label: "Share on Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <TelegramIcon />,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: <WhatsAppIcon />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-rr-muted">
        Share:
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rr-border bg-rr-surface text-rr-secondary transition hover:bg-rr-elevated hover:text-rr-primary"
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

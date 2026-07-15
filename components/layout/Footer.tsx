import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <p className="font-mono text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} portfolio. All systems nominal.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-neutral-500 transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </Link>
            <Link
              href="#"
              className="text-neutral-500 transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

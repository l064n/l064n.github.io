import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a]/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Left: Copyright + status */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="font-mono text-xs text-zinc-600">
              <span className="text-zinc-700">{'$'}</span>{' '}
              {`echo "© ${new Date().getFullYear()} Logan Matthew Phillips"`}
            </p>
            <p className="font-mono text-[10px] text-zinc-700">
              Built with Next.js · Tailwind · Framer Motion
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/l064n"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[#1a1a1a] bg-[#111]/50 p-2 text-zinc-600 transition-all hover:border-zinc-700 hover:text-zinc-300 hover:bg-[#151515]"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/loganmphillips/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[#1a1a1a] bg-[#111]/50 p-2 text-zinc-600 transition-all hover:border-zinc-700 hover:text-zinc-300 hover:bg-[#151515]"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4" />
            </Link>
            <Link
              href="mailto:phillips.logan.sc@gmail.com"
              className="rounded-md border border-[#1a1a1a] bg-[#111]/50 p-2 text-zinc-600 transition-all hover:border-zinc-700 hover:text-zinc-300 hover:bg-[#151515]"
              aria-label="Email"
            >
              <Mail className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

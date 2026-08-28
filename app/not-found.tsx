import Link from 'next/link';

export const metadata = {
  title: '404 — Not Found',
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-28 text-center sm:py-36">
      <div className="w-full max-w-md rounded-xl border border-zinc-800/60 bg-[#111] text-left">
        {/* terminal chrome */}
        <div className="flex items-center gap-1.5 border-b border-zinc-800/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-[11px] text-zinc-600">logan@cluster: ~</span>
        </div>
        <div className="space-y-1.5 p-5 font-mono text-sm">
          <p>
            <span className="text-accent">$</span>
            <span className="text-zinc-200"> open /unknown</span>
          </p>
          <p className="text-zinc-500">
            zsh: no such file or directory: <span className="text-red-400/80">/unknown</span>
          </p>
          <p>
            <span className="text-accent">$</span>
            <span className="text-zinc-200"> exit </span>
            <span className="text-red-400/80">1</span>
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-100">404 — page not found</h1>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
          This path does not exist. It may have been moved, renamed, or never existed at all.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md border border-zinc-800 bg-[#171717] px-4 py-2 font-mono text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
        >
          $ cd ~
        </Link>
      </div>
    </section>
  );
}

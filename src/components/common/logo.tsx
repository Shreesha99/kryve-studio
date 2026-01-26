import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center leading-none">
      <span className="font-headline text-2xl font-bold">KRYVE</span>
      <span className="w-full text-[0.5rem] font-light uppercase tracking-[0.22em] text-center">
        Studios
      </span>
    </Link>
  );
}

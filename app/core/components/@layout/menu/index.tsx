'use client';

import Link from 'next/link';

import Navigation from './navigation';

export default function Menu() {
  return (
    <header className="menu">
      <Link href="/lobby">
        <h2 className="service-logo">로고</h2>
      </Link>
      <Navigation />
    </header>
  );
}

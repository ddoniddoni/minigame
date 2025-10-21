import type { Metadata } from 'next';

import '../app/assets/styles/lobby.ui.scss';

export const metadata: Metadata = {
  title: 'MINI GAMES',
  description: 'Mini games',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

import dynamic from 'next/dynamic';

import { Copyright } from '@ui/@layout';
import Menu from '@ui/@layout/menu';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-default">
      <Menu />
      <div className="layout-default-contents">{children}</div>
      <Copyright />
    </div>
  );
}

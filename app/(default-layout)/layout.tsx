import { Copyright } from '@ui/@layout';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-default">
      <div className="layout-default-contents">{children}</div>
      <Copyright />
    </div>
  );
}

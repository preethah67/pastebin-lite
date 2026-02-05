import './globals.css';

export const metadata = {
  title: 'Pastebin Lite',
  description: 'Fast, secure code sharing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}
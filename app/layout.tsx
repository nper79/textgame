import '@/app/globals.css'

export const metadata = {
  title: 'Text Game',
  description: 'Uma aventura textual interativa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  )
}

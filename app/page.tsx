import Link from 'next/link'
import TranslatableWord from './TranslatableWord';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function Home() {
  return (
    <main>
      <h1>Sua Aventura Cyberpunk</h1>
      <Link href="/select-adventure">Iniciar Aventura</Link>
    </main>
  )
}

import Link from 'next/link'
import TranslatableWord from './TranslatableWord';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black">
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-8 text-cyan-400">Adventure Translator</h1>
        <p className="text-xl mb-8 text-white">Escolha sua aventura e aprenda um novo idioma!</p>
        <Link href="/select-adventure" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
          Começar Aventura
        </Link>
      </div>
    </div>
  )
}

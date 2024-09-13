import Image from 'next/image'

export default function TestImage() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <Image
        src="/images/cyberbackground.webp"
        alt="Teste de imagem cyberpunk"
        fill
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
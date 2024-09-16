import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface StoryCardProps {
  title?: string
  summary?: string
  image: string
  id: string
}

function StoryCard({ title = "Title of adventure", summary = "Summary of the adventure goes here. This is a brief description of what the player can expect.", image, id }: StoryCardProps) {
  return (
    <Card className="bg-gray-800 border-none overflow-hidden w-full flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <hr className="border-t border-gray-700 m-0" />
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-300 mb-4 flex-grow">{summary}</p>
        <Link href={`/select-language?id=${id}`} passHref>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Play
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

const featuredStory = {
  title: "New Dev Log: Planning the Unplannable",
  description: "Discover how our team tackles the challenges of game development in our latest dev log.",
  image: "/placeholder.svg?height=400&width=800"
}

const stories = [
  {
    id: "blue-mage",
    title: "You Are A Blue Mage, But T...",
    summary: "Blue Mages are a special type of magic user, who forges the typical choice of whether they want to heal or deal damage, instead ...",
    image: "/images/blue-mage.jpg"
  },
  {
    id: "enchanted-forest",
    title: "The Enchanted Forest",
    summary: "Explore a mystical forest filled with magical creatures and hidden treasures. Your choices will shape the fate of this enchanted realm.",
    image: "/images/enchanted-forest.jpg"
  },
  {
    id: "cyberpunk-adventure",
    title: "Cyberpunk Detective",
    summary: "In a neon-lit future, you're a detective with cybernetic enhancements. Solve crimes and uncover conspiracies in this thrilling sci-fi adventure.",
    image: "/images/cyberpunk-detective.jpg"
  },
  {
    id: "pirate-legacy",
    title: "Pirate's Legacy",
    summary: "Set sail on the high seas as a daring pirate captain. Build your crew, find treasure, and become a legend of the Caribbean.",
    image: "/images/pirate-legacy.jpg"
  },
  { id: "placeholder-1", image: "/images/placeholder-1.jpg", title: "Coming Soon", summary: "New adventure coming soon!" },
  { id: "placeholder-2", image: "/images/placeholder-2.jpg", title: "Coming Soon", summary: "New adventure coming soon!" },
  { id: "placeholder-3", image: "/images/placeholder-3.jpg", title: "Coming Soon", summary: "New adventure coming soon!" },
  { id: "placeholder-4", image: "/images/placeholder-4.jpg", title: "Coming Soon", summary: "New adventure coming soon!" }
]

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 py-4">
        <nav className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">StoryQuest</h1>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
            Sign In
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <Card className="bg-gray-800 border-none overflow-hidden">
            <div className="relative h-96">
              <Image
                src={featuredStory.image}
                alt={featuredStory.title}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-end p-6">
                <h2 className="text-3xl font-bold mb-2">{featuredStory.title}</h2>
                <p className="mb-4">{featuredStory.description}</p>
                <Button className="w-32">Read More</Button>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story, index) => (
              <StoryCard key={index} {...story} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
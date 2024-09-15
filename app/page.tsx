import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { storyPrompts, StoryPrompt } from '@/data/storyPrompts'

function StoryCard({ id, title, summary, image }: StoryPrompt) {
  return (
    <Card className="bg-gray-800 border-none overflow-hidden w-full flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
        />
      </div>
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
            {storyPrompts.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
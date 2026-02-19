import { createFileRoute } from '@tanstack/react-router'
import { ForestStoryComponent } from '@/components/ForestStory'

export const Route = createFileRoute('/forest-story')({
  component: () => (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800">
      <ForestStoryComponent className="w-full" />
    </div>
  ),
})
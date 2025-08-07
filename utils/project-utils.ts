export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const getTechnologyColor = (tech: string): string => {
  const colors: Record<string, string> = {
    'React': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'TypeScript': 'bg-blue-700/10 text-blue-700 border-blue-700/20',
    'JavaScript': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    'Python': 'bg-green-500/10 text-green-600 border-green-500/20',
    'Node.js': 'bg-green-700/10 text-green-700 border-green-700/20',
    'Next.js': 'bg-gray-800/10 text-gray-800 border-gray-800/20',
    'Vue': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Angular': 'bg-red-500/10 text-red-600 border-red-500/20',
  }
  return colors[tech] || 'bg-gray-500/10 text-gray-600 border-gray-500/20'
}

export const shareProject = async (title: string, url?: string) => {
  if (navigator.share && url) {
    try {
      await navigator.share({
        title: `Check out: ${title}`,
        url: url,
      })
    } catch (err) {
      console.log('Error sharing:', err)
    }
  } else if (url) {
    navigator.clipboard.writeText(url)
  }
}

export const hapticFeedback = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
}

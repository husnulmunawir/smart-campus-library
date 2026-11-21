import type { Buku } from '../types'

function fallbackCover(buku: Buku): string {
  const title = buku.judul.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="#751D24"/>
    <rect x="22" y="22" width="356" height="556" fill="none" stroke="#C69B42" stroke-width="2"/>
    <text x="40" y="100" fill="#C69B42" font-family="Georgia,serif" font-size="20" letter-spacing="3">SMART CAMPUS</text>
    <text x="40" y="300" fill="#FFFFFF" font-family="Georgia,serif" font-size="34">${title}</text>
    <text x="40" y="520" fill="#E8D8B5" font-family="Arial,sans-serif" font-size="18">${buku.penulis.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function BookCover({
  buku,
  className = '',
}: {
  buku: Buku
  className?: string
}) {
  return (
    <img
      src={buku.cover}
      alt={`Sampul buku ${buku.judul}`}
      loading="lazy"
      onError={(event) => {
        if (event.currentTarget.dataset.fallback !== 'true') {
          event.currentTarget.dataset.fallback = 'true'
          event.currentTarget.src = fallbackCover(buku)
        }
      }}
      className={`aspect-[2/3] w-full rounded-lg object-cover shadow-sm ring-1 ring-black/5 ${className}`}
    />
  )
}

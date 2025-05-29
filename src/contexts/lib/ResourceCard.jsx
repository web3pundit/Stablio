import { useState } from 'react';
import BookmarkButton from './BookmarkButton';

export default function ResourceCard({ resource }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col transition hover:shadow-md duration-200">
      <div className="w-full aspect-video mb-4 overflow-hidden rounded">
        <img
          src={imgError || !resource.thumbnail ? '/placeholder-thumbnail.png' : resource.thumbnail}
          alt={resource.title}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-1 line-clamp-2">{resource.title}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{resource.description}</p>
        <p className="text-xs text-blue-500 capitalize">
          {resource.type} • {resource.audience}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View Resource →
        </a>
        <BookmarkButton resourceId={resource.id} />
      </div>
    </div>
  );
}

export default function ResourceCard({ resource }) {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white flex flex-col">
      <div className="w-full aspect-video mb-4 rounded overflow-hidden">
        <img
          src={resource.thumbnail || '/placeholder-thumbnail.png'}
          alt={resource.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = '/placeholder-thumbnail.png'; }}
        />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
        <p className="text-xs text-blue-500 mb-2 capitalize">{resource.type} • {resource.audience}</p>
      </div>
      <div className="mt-4">
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View Resource →
        </a>
      </div>
    </div>
  );
}

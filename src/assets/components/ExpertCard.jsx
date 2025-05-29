export default function ExpertCard({ expert }) {
  const { name, role, avatar, profile_link } = expert;

  return (
    <div className="card flex flex-col items-center text-center">
      <img
        src={avatar || '/default-profile.png'}
        alt={name}
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="text-subtle mb-4">{role || 'Industry Expert'}</p>
      {profile_link && (
        <a
          href={profile_link}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          View X Profile →
        </a>
      )}
    </div>
  );
}

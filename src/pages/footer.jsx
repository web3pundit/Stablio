import FeedbackForm from '../assets/components/FeedbackForm';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Have feedback or suggestions?
          </p>
          <p className="text-gray-600 mb-4">
            We’d love to hear from you! Fill out the form below to help us improve Stablio.
          </p>
          <FeedbackForm />
        </div>
        <div className="text-center text-sm text-gray-600 mt-8">
          Built with ❤️ by{' '}
          <a
            href="https://x.com/web3_pundit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @Web3Pundit
          </a>
        </div>
      </div>
    </footer>
  );
}
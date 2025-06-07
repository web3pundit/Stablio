import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';

const Landing = () => {
  return (
    <div className="page-container py-10 sm:py-16 space-y-16 sm:space-y-28 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <Helmet>
        <title>Stablecoin Knowledge Hub | Stablio</title>
        <meta name="description" content="Trusted knowledge for the stablecoin community. Explore curated resources, regulatory updates, and expert insights—all in one place with Stablio." />
      </Helmet>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12 px-4">
        <div className="flex-1 w-full">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-center md:text-left">
            Cut Through the Noise.<br />Understand Stablecoins with Confidence.
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-8 text-center md:text-left">
            Stablio helps you make sense of the stablecoin ecosystem with curated resources, real-time regulatory tracking, and expert analysis — all in one place.
          </p>
          <div className="flex justify-center md:justify-start">
            <Link to="/resources" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full shadow hover:shadow-lg transition font-semibold">
              Explore Stablecoin Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <hr className="border-gray-200" />
      </div>

      {/* Why Stablio Section */}
      <section className="text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-8 sm:mb-12">Why Stablio?</h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div className="card bg-white rounded-xl shadow-md p-6 sm:p-8 hover:shadow-xl transition">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-800">Curated, Not Crowdsourced</h3>
            <p className="text-gray-700">
              Access handpicked tools, reports, and explainers.
            </p>
          </div>
          <div className="card bg-white rounded-xl shadow-md p-6 sm:p-8 hover:shadow-xl transition">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-800">Global Regulatory Tracker</h3>
            <p className="text-gray-700">
              Follow region-specific updates to stay ahead of legal developments and compliance risks.
            </p>
          </div>
          <div className="card bg-white rounded-xl shadow-md p-6 sm:p-8 hover:shadow-xl transition">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-800">Expert-Driven Insights</h3>
            <p className="text-gray-700">
              Learn from the builders, analysts, and policymakers shaping stablecoin adoption.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <hr className="border-gray-200" />
      </div>

      {/* Who It's For Section */}
      <section className="px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-8 sm:mb-12 text-center">Who It's For</h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          <div className="space-y-4 sm:space-y-6">
            <div className="card bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-xl transition">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Investors & Researchers</h3>
              <p className="text-gray-700">
                Exploring the policy and mechanics of stablecoins.
              </p>
            </div>
            <div className="card bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-xl transition">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Builders & Product Teams</h3>
              <p className="text-gray-700">
                Evaluating assets to integrate and tools to use.
              </p>
            </div>
            <div className="card bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-xl transition">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Regulators & Analysts</h3>
              <p className="text-gray-700">
                Tracking adoption and legal clarity.
              </p>
            </div>
          </div>
          <div className="card flex flex-col justify-center bg-blue-50 rounded-xl shadow-md p-6 sm:p-8 hover:shadow-xl transition mt-4 md:mt-0">
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Why It’s Better Than Googling</h3>
            <p className="text-gray-700">
              Skip the endless tabs. Stablio filters the noise and surfaces what matters.
            </p>
          </div>
        </div>
        <div className="text-center mt-8 sm:mt-10">
          <Link to="/regulatory" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full shadow hover:shadow-lg transition font-semibold">
            Browse Regulatory Tracker
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
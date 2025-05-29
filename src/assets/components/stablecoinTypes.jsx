import { useState } from 'react'
// Import logos
import usdcLogo from '../../assets/logos/usdc.png'
import daiLogo from '../../assets/logos/dai.png'
import tetherLogo from '../../assets/logos/tether.png'

const stablecoinTypes = {
  'Fiat-backed': [
    {
      name: 'USDC',
      description: 'A fiat-backed stablecoin pegged 1:1 to the USD.',
      logo: usdcLogo,
      officialLink: 'https://www.circle.com/en/usdc'
    },
    {
      name: 'USDT (Tether)',
      description: 'Widely used USD stablecoin backed by reserves.',
      logo: tetherLogo,
      officialLink: 'https://tether.to'
    }
  ],
  'Crypto-backed': [
    {
      name: 'DAI',
      description: 'A crypto-collateralized stablecoin governed by MakerDAO.',
      logo: daiLogo,
      officialLink: 'https://makerdao.com/en/dai'
    }
  ],
  // Add more types...
}

export default function StablecoinTypes() {
  const [openType, setOpenType] = useState(null)

  const toggleType = (type) => {
    setOpenType(openType === type ? null : type)
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Explore Stablecoin Types</h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {Object.entries(stablecoinTypes).map(([type, coins]) => (
          <div key={type} className="bg-white rounded-lg shadow p-4">
            <button
              onClick={() => toggleType(type)}
              className="w-full text-left text-xl font-semibold text-blue-700 flex justify-between items-center"
            >
              {type}
              <span>{openType === type ? '-' : '+'}</span>
            </button>

            {openType === type && (
              <div className="mt-4 space-y-4">
                {coins.map((coin) => (
                  <div key={coin.name} className="flex items-center gap-4 bg-gray-50 p-4 rounded-md">
                    <img src={coin.logo} alt={coin.name} className="w-12 h-12 object-contain" />
                    <div className="flex flex-col">
                      <h2 className="text-lg font-bold">{coin.name}</h2>
                      <p className="text-gray-600 text-sm">{coin.description}</p>
                      <a
                        href={coin.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm mt-1 underline"
                      >
                        Learn More →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

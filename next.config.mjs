/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/speisekarte',
        destination: '/de/speisekarte',
        permanent: true,
      },
    ];
  },
};

export default config;
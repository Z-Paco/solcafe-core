/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rahpbleetefpgggbolsh.supabase.co",
      },
    ],
  },
  // Old per-type editor URLs now live under /write.
  async redirects() {
    return [
      { source: "/:type(news|art|engineer)/create", destination: "/write?type=:type", permanent: true },
      { source: "/:type(news|art|engineer)/edit/:slug", destination: "/write/:type/:slug", permanent: true },
    ];
  },
};

module.exports = nextConfig;

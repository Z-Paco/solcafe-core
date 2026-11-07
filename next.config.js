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
  // Sign-up is closed (authors are invited) and the roles page is retired;
  // both are temporary so they can come back without stale browser caches.
  async redirects() {
    return [
      { source: "/:type(news|art|engineer)/create", destination: "/write?type=:type", permanent: true },
      { source: "/:type(news|art|engineer)/edit/:slug", destination: "/write/:type/:slug", permanent: true },
      { source: "/signup", destination: "/login", permanent: false },
      { source: "/about/roles", destination: "/about", permanent: false },
    ];
  },
};

module.exports = nextConfig;

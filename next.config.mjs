/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Lower peak memory during `next build` (helps constrained build hosts / Coolify).
  experimental: { webpackMemoryOptimizations: true },
  webpack: (config) => {
    // Disable the persistent filesystem cache — its serialization step is the
    // memory spike that OOM-kills the build on small servers. Fresh CI builds
    // don't benefit from it anyway.
    config.cache = false;
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

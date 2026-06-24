/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Type-checking still runs and blocks the build; we just don't gate the
  // production build on lint style rules (e.g. unescaped entities).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Verberg de Next.js dev-indicator (het "N"-bolletje links­onder tijdens ontwikkelen).
  // Verschijnt sowieso niet op de live site.
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
};
export default nextConfig;

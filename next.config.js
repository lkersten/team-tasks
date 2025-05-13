/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://192.168.4.135:3000", // replace with your dev server's LAN address and port
    "http://localhost:3000",     // always good to keep localhost
  ],
};

export default nextConfig; 
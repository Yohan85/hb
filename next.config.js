/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["v5.airtableusercontent.com"], // Ajoutez le domaine d'Airtable ici
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */

console.log("PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);

const NextAppConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["example.com"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "res.cloudinary.com",
    //     port: "",
    //     pathname: "/*/image/upload/**",
    //   },
    // ],
  },
};

module.exports = NextAppConfig;

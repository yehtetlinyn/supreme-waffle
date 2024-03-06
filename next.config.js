/** @type {import('next').NextConfig} */

console.log("PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);

const NextAppConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["tossakan.s3.ap-southeast-1.wasabisys.com"],
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

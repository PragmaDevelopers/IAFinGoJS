/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async function() {
        return [
            {
                source: '/',
                destination: '/signup',
                permanent: true,
            }
        ]
    },
};

export default nextConfig;

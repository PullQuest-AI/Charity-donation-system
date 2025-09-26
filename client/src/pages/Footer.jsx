import brandLogo from "../assets/heartChainlogo.png";

// Helper component for social media icons for cleaner code
const SocialIcon = ({ href, children }) => (
  <a href={href} className="text-gray-400 transition-all duration-300 hover:text-[#ea638c] hover:scale-110 transform">
    {children}
  </a>
);

const Footer = () => {
  const navLinks = {
    Platform: ["Campaign Management", "Smart Contracts", "Analytics", "Donor Portal"],
    Company: ["About", "Careers", "Press", "Contact"],
    Resources: ["Documentation", "Help Center", "Blog", "Community"],
  };

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden pt-24 pb-16">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>
      
      {/* Background Aurora Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ea638c] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#98465f] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top Section: CTA & Newsletter */}
        <div className="text-center mb-20">
          <img src={brandLogo} alt="HeartChain Logo" className="h-16 w-auto mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Join the Future of Fundraising
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Get the latest insights, product updates, and nonprofit strategies delivered right to your inbox.
          </p>
          <form className="relative max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ea638c] transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-[#ea638c] text-white px-6 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out transform hover:bg-[#d4547c] hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(navLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-5">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 transition-all duration-300 hover:text-[#ea638c] hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Social Connect Column */}
          <div>
            <h3 className="font-semibold text-white mb-5">Connect</h3>
            <div className="flex items-center space-x-5">
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} HeartChain. All rights reserved. Empowering nonprofits through blockchain.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
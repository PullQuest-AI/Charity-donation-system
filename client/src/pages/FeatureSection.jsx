const UsersIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChartIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 3v18h18" />
        <path d="m18.7 8-5.1 5.2-2.8-2.7L7 15.2" />
    </svg>
);

const FeaturesSection = () => {
  const features = [
    {
      title: 'Raise More',
      description: 'By doing what you do best—creating lasting relationships with donors.',
      Icon: UsersIcon,
    },
    {
      title: 'Save Time',
      description: 'Automate tedious tasks and spend more time on your mission.',
      Icon: ClockIcon,
    },
    {
      title: 'Gain Insights',
      description: 'Understand your donor base with powerful, easy-to-use analytics.',
      Icon: ChartIcon,
    },
  ];

  return (
    <section className="bg-black text-white py-24 sm:py-32 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-[#ff66c4]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Main Text Content */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-semibold text-[#ea638c] uppercase tracking-wider">Why Heart Chain</p>
          <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tighter text-white">
            Software that helps
            <span
              className="block mt-2 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text"
            >
              you connect transparently.
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-400">
            Our platform empowers you to exceed your fundraising goals by focusing on direct payments via your crypto wallets.
          </p>
          <div className="mt-10">
            {/* --- MODIFIED BUTTON --- */}
            <a
              href="#"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#ea638c]/40"
            >
              Take a Tour
            </a>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            // --- MODIFIED CARD ---
            <div
              key={feature.title}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg group transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ea638c]/20"
            >
              <div className="bg-white/10 rounded-xl w-14 h-14 flex items-center justify-center border border-white/10 group-hover:bg-[#ea638c] group-hover:border-[#ff66c4] transition-all duration-300 ease-in-out">
                {/* --- MODIFIED ICON --- */}
                <feature.Icon className="text-white h-7 w-7 transition-all duration-300 ease-in-out transform group-hover:scale-110 group-hover:rotate-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
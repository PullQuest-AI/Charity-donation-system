import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "HeartChain helped us save about 8 hours a week on donation tracking. Our donors appreciate being able to see exactly where their money goes.",
      author: "Sarah Chen",
      role: "Executive Director",
      organization: "Global Impact Foundation",
    },
    {
      quote: "The platform is straightforward to use. We've seen a modest increase in recurring donations since we started showing transaction transparency.",
      author: "Marcus Rodriguez",
      role: "Founder",
      organization: "Clean Water Initiative",
    },
    {
      quote: "It took some getting used to, but the real-time reporting has been helpful for our quarterly reviews. Donors seem to trust the process more.",
      author: "Dr. Emily Watson",
      role: "Development Director",
      organization: "Education For All",
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const current = testimonials[currentTestimonial];

  return (
    <section className="relative min-h-screen bg-black text-white flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background Aurora Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ea638c] rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#98465f] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4">
            Trusted by Innovators
          </h2>
          <p className="text-lg text-gray-400">
            Real feedback from organizations making a difference.
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-lg p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
          {/* Decorative Quote Icon */}
          <span className="absolute top-0 left-0 -translate-x-4 -translate-y-4 text-9xl font-serif text-white/10">
            “
          </span>

          {/* Animated Content Wrapper */}
          <div key={currentTestimonial} className="animate-fade-in">
            <blockquote className="text-xl md:text-2xl leading-relaxed text-gray-200 mb-6 font-light">
              {current.quote}
            </blockquote>
            <div className="mt-8">
              <div className="font-semibold text-white text-lg">{current.author}</div>
              <div className="text-[#ea638c] text-sm">{`${current.role}, ${current.organization}`}</div>
            </div>
          </div>
        </div>

        {/* Interactive Organization Navigation */}
        <div className="flex justify-center items-center flex-wrap gap-4 mt-12">
          {testimonials.map((person, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none transform hover:-translate-y-1 ${
                index === currentTestimonial
                  ? 'bg-[#ea638c] text-white shadow-lg shadow-[#ea638c]/50'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              }`}
              aria-label={`View testimonial from ${person.organization}`}
            >
              {person.organization}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
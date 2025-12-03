import { Sparkles, Star } from "lucide-react";
// No translations needed for now

export function TrustSection() {
  return (
    <section className="relative z-10 section-padding bg-gradient-to-b from-transparent to-black/20">
      <div className="container-premium mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">
              10K+
            </div>
            <div className="text-sm md:text-base text-white/60">
              Active Users
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">
              50K+
            </div>
            <div className="text-sm md:text-base text-white/60">
              Marketing Goals
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">
              95%
            </div>
            <div className="text-sm md:text-base text-white/60">
              Success Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">
              24/7
            </div>
            <div className="text-sm md:text-base text-white/60">AI Support</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Marketing Teams Worldwide
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            See what our users say about Houston
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Testimonial 1 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#00D4FF]/50 transition-all duration-300">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#FFD700] text-[#FFD700]"
                />
              ))}
            </div>
            <p className="text-white/80 mb-4">
              "Houston transformed our marketing strategy. The AI insights are
              incredibly accurate and actionable."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] flex items-center justify-center text-white font-bold">
                SM
              </div>
              <div>
                <div className="text-white font-medium">Sarah Miller</div>
                <div className="text-white/60 text-sm">
                  Marketing Director, TechCorp
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#00D4FF]/50 transition-all duration-300">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#FFD700] text-[#FFD700]"
                />
              ))}
            </div>
            <p className="text-white/80 mb-4">
              "The goal tracking and AI recommendations helped us achieve 150%
              ROI in just 3 months."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold">
                JC
              </div>
              <div>
                <div className="text-white font-medium">James Chen</div>
                <div className="text-white/60 text-sm">CEO, GrowthLabs</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#00D4FF]/50 transition-all duration-300">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#FFD700] text-[#FFD700]"
                />
              ))}
            </div>
            <p className="text-white/80 mb-4">
              "Best marketing AI tool we've used. The chat interface makes it so
              easy to get strategic advice."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#FF6B9D] flex items-center justify-center text-white font-bold">
                ER
              </div>
              <div>
                <div className="text-white font-medium">Emma Rodriguez</div>
                <div className="text-white/60 text-sm">CMO, StartupHub</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
            <span className="text-sm text-white/80 font-medium">
              🔒 Enterprise-Grade Security
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
            <span className="text-sm text-white/80 font-medium">
              ⚡ 99.9% Uptime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

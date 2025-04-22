import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Lightbulb, 
  Palette, 
  Users, 
  Shield, 
  Sparkles 
} from 'lucide-react';

export default function WhyChooseUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: AlertTriangle,
      title: "The Problem with Traditional Spraying",
      content: "Let's be honest spraying real money at parties used to be fun... but now it's risky. In Nigeria, spraying the Naira has been banned. On top of that, people lose money, envelopes go missing, and counting sprayed cash becomes a late-night chore. It's stressful, messy, and honestly, not worth it anymore.",
      bgColor: "bg-red-50",
      iconColor: "text-red-500"
    },
    {
      icon: Lightbulb,
      title: "The Party Currency Solution",
      content: "We created Party Currency so you can still enjoy the fun of spraying without any of the problems. Our special event notes are beautiful, safe, and unique. And here's the best part: after your event, the full amount sprayed is sent straight to your account. No missing cash. No confusion. Just easy, happy celebration.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      icon: Palette,
      title: "Designed for You, by You",
      content: "Your party should look and feel like you. That's why we let you design your own party notes! Add your photo, customize your text and watch your vision come to life. It's simple, fun, and makes your celebration extra personal and unforgettable.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    },
    {
      icon: Users,
      title: "Trusted by Happy Celebrants",
      content: "Weddings, birthdays, baby showers, graduations we've been part of them all. And our customers always say the same thing: 'This made our day feel so much more special.' We take care of the little things so you can enjoy every big moment.",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      icon: Shield,
      title: "Secure, Seamless & Stylish",
      content: "Planning a big event? We've got your back. When you choose Party Currency, you're not just getting printed notes — you're getting support from start to finish. Our event management feature helps you organize your celebration with ease. We handle the spraying, tracking, and guest support, so you can relax and enjoy the spotlight.",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="flex-grow pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Party Currency
            </h1>
            <p className="text-base text-center sm:text-lg text-gray-600 font-montserrat max-w-2xl mx-auto">
              Discover how we're revolutionizing the way you celebrate special moments
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <section 
                  key={index}
                  className={`${section.bgColor} text-left rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg sm:hover:shadow-xl`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-full ${section.bgColor} ${section.iconColor} flex-shrink-0`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-gray-900 mb-3 sm:mb-4">
                        {section.title}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-12 sm:mt-16">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-semibold">Ready to make your celebration special?</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 
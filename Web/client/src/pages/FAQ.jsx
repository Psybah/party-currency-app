import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, HelpCircle, DollarSign, Fingerprint, Image, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FAQItem = ({ question, answer, icon: Icon, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-none">
      <button
        className="w-full py-6 text-left focus:outline-none"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-bluePrimary/10 text-bluePrimary">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 font-montserrat pr-8">
              {question}
            </h3>
          </div>
          <ChevronDown 
            className={cn(
              "w-5 h-5 md:w-6 md:h-6 text-gray-500 transition-transform duration-300",
              isOpen && "transform rotate-180"
            )} 
          />
        </div>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-montserrat pl-16 text-left">
          {answer}
        </p>
      </div>
    </div>
  );
};

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqItems = [
    {
      icon: Calendar,
      question: "What kinds of events can I use Party Currency for?",
      answer: "Weddings, baby showers, dedications — if it's a moment worth remembering, we're there with premium prints that elevate every celebration."
    },
    {
      icon: DollarSign,
      question: "How are we different from regular money changers?",
      answer: "Traditional money changers simply sell mint notes and walk away leaving you to deal with the stress. At Party Currency, we elevate the experience. We provide your guests with beautifully crafted party notes to spray, and after the celebration, we transfer the total amount sprayed directly to your account. No more stolen envelopes. No more late-night counting. Just pure celebration handled with elegance and ease."
    },
    {
      icon: HelpCircle,
      question: "How are our rates different from those of traditional money changers?",
      answer: "Unlike regular money changers who charge up to ₦150,000 just to spray ₦100,000, with unpredictable rates and hidden fees, Party Currency keeps it simple. We're transparent, far more affordable, and fully stocked with your favorite denominations from ₦200 to crisp ₦1000 bills. No guesswork. No shortage. Just seamless celebration at a better price."
    },
    {
      icon: Fingerprint,
      question: "How do we make sure real money never gets mixed with party currency?",
      answer: "The good news? Our Party Currency notes design makes it easy to distinguish tokens from real cash — no mix-ups, no confusion. The even better news? The money's already in your account. No counting. No stress. Just a smooth, secure celebration."
    },
    {
      icon: Image,
      question: "Is it possible to customize the notes with personal images?",
      answer: "Of course we customize every note to match your unique vision. With our built-in design studio, you can easily upload your photo, adjust fonts, and personalize every detail to make your big day even more unforgettable."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="flex-grow pt-32 md:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-4 md:mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-montserrat">
              What are you curious about?
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                {...item}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm sm:text-base text-gray-600 font-montserrat">
              Still have questions? {" "}
              <Link 
                to="/#contact" 
                className="text-bluePrimary hover:text-blueSecondary font-semibold"
                onClick={() => window.scrollTo(0, 0)}
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 
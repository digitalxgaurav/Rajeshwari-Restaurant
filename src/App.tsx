/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  Car,
  Bell,
  UtensilsCrossed,
  Droplet,
  ShieldCheck,
  Cpu,
  MapPin,
  Phone,
  Bookmark,
  Star,
  Search,
  Check,
  X,
  Menu,
  ChevronRight,
  Send,
  MessageSquare,
  Calendar,
  Users,
  Navigation,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  ChevronLeft,
  Info
} from 'lucide-react';

import { MenuItem, RoomType, Review, GalleryItem, BookingFormInput, ChatMessage } from './types';
import { BUSINESS_INFO, ROOM_TYPES, MENU_ITEMS, AMENITIES, WHY_CHOOSE_US, REVIEWS, GALLERY_ITEMS, FAQS } from './data';

// Map icon string names to standard Lucide icons robustly
const IconMap: Record<string, React.ComponentType<any>> = {
  Wifi: Wifi,
  ParkingSquare: Car,
  Bell: Bell,
  UtensilsCrossed: UtensilsCrossed,
  Droplet: Droplet,
  ShieldCheck: ShieldCheck,
  Cpu: Cpu,
  MapPin: MapPin,
};

export default function App() {
  // Mobile menu control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation active scroll highlight
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  // Restaurant Menu filters and keyword search state
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<'All' | 'Beverages' | 'Starters' | 'Chinese' | 'Soups'>('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Gallery filters and Lightbox control
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<'All' | 'Hotel Exterior' | 'Rooms' | 'Restaurant' | 'Dining Area' | 'Food' | 'Guests'>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Booking Form values
  const [bookingInput, setBookingInput] = useState<BookingFormInput>({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: 'deluxe',
    specialRequest: ''
  });
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    bookingId: string;
    whatsappUrl: string;
    message: string;
  } | null>(null);

  // AI Chatbot State ('Ananya')
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! 🙏 Welcome to Rajeshwari Hotel & Restaurant, Mangarh. I am Ananya, your hospitality virtual host. How can I assist you with your stay or dining near Kripalu Dham today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active Hero Slide background rotations
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlides = [
    {
      image: "/src/assets/images/hotel_exterior_1780800411363.png",
      title: "Rajeshwari Hotel & Restaurant",
      tagline: "Comfortable Stay • Delicious Food • Family Hospitality",
      sub: "Experience warm premium hospitality just 2 minutes walking distance from Kripalu Dham entrance Gate."
    },
    {
      image: "/src/assets/images/room_deluxe_1780800430158.png",
      title: "Luxurious Hotel Accommodations",
      tagline: "Spotless, Cozy, and peaceful rooms for pilgrims and families",
      sub: "AC, high-speed WiFi, modern bathrooms, and full room service tailored for a peaceful devotee experience."
    },
    {
      image: "/src/assets/images/restaurant_interior_1780800482310.png",
      title: "Authentic Pure Vegetarian Dining",
      tagline: "Shuddh Shakahari Delicacies separate from crosscontact",
      sub: "Spicy North Indian, savory Chinese, hot Beverages, and dynamic family seating with rapid service."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Track header scroll transformation & section highlighting
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Section tracker
      const sections = ['hero', 'about', 'rooms', 'restaurant', 'amenities', 'reviews', 'gallery', 'location', 'booking'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll chat window to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Calculate dynamic pricing helper based on nights and selected room
  const stayCalculations = useMemo(() => {
    if (!bookingInput.checkIn || !bookingInput.checkOut) return null;
    const date1 = new Date(bookingInput.checkIn);
    const date2 = new Date(bookingInput.checkOut);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const selectedRoom = ROOM_TYPES.find(r => r.id === bookingInput.roomType);
    const basePrice = selectedRoom ? selectedRoom.price : 1000;
    const totalCost = basePrice * (diffDays || 1);

    return {
      nights: diffDays || 1,
      rate: basePrice,
      total: totalCost
    };
  }, [bookingInput.checkIn, bookingInput.checkOut, bookingInput.roomType]);

  // Filter Menu items on search text and selected category
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory = selectedMenuCategory === 'All' || item.category === selectedMenuCategory;
      const matchSearch = item.name.toLowerCase().includes(menuSearchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedMenuCategory, menuSearchQuery]);

  // Filter Gallery items
  const filteredGalleryItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      return selectedGalleryCategory === 'All' || item.category === selectedGalleryCategory;
    });
  }, [selectedGalleryCategory]);

  // Handle Room Booking Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingInput.name || !bookingInput.phone || !bookingInput.checkIn || !bookingInput.checkOut) {
      alert("Please fill in all standard details including name, phone, and booking dates.");
      return;
    }

    setIsBookingSubmitting(true);
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingInput)
      });
      const data = await response.json();
      if (data.success) {
        setBookingResult(data);
      } else {
        alert("Booking registration encountered issues. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Fallback unique ID generation in case of server hitch
      const tempId = "RHR-TEMP-" + Math.floor(100000 + Math.random() * 900000);
      const textParam = encodeURIComponent(`Namaste! Request for booking:\nName: ${bookingInput.name}\nPhone: ${bookingInput.phone}\nRoom: ${bookingInput.roomType}\nCheck-In: ${bookingInput.checkIn}\nCheck-Out: ${bookingInput.checkOut}`);
      setBookingResult({
        success: true,
        bookingId: tempId,
        whatsappUrl: `https://wa.me/919044351480?text=${textParam}`,
        message: "Your booking was registered with standard pre-approval codes."
      });
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  // Select a room from list and scroll straight down with preselection
  const handleRoomSelect = (roomId: string) => {
    setBookingInput(prev => ({ ...prev, roomType: roomId }));
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // AI Chat Messages Handling
  const handleSendMessage = async (textToSend?: string) => {
    const rawMsg = textToSend || chatInput;
    if (!rawMsg.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: 'user',
      text: rawMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsChatLoading(true);

    // Prepare full context sequence for the API
    const updatedHistory = [...chatMessages, userMsg].map(({ role, text }) => ({ role, text }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedHistory })
      });
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: 'model',
        text: data.text || "Namaste, I can assist you with bookings and hotel specialties. Please call +91 90443 51480 for details.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Assistant network query issue:", err);
      const errMsg: ChatMessage = {
        id: "ai-err-" + Date.now(),
        role: 'model',
        text: "Namaste! I have slightly unstable connection at the moment. However, we're ready to welcome you. Please tap 'Call Desk' or reach out via WhatsApp at +91 90443 51480 so we can address your question instantly!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Parse custom styled text format safely
  const formatTextWithBoldStyles = (msg: string) => {
    const lines = msg.split('\n');
    return lines.map((line, i) => {
      // Handle simple list layout
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const textToStyle = isBullet ? line.replace(/^[\s•-]*\s*/, '') : line;

      // Handle simple inline bold text split
      const segments = textToStyle.split('**');
      const renderedLine = segments.map((seg, idx) => {
        if (idx % 2 === 1) {
          return <strong key={idx} className="font-bold text-maroon-700">{seg}</strong>;
        }
        return seg;
      });

      return (
        <div key={i} className={`my-1 leading-relaxed ${isBullet ? 'pl-4 relative before:content-["•"] before:absolute before:left-1 before:text-gold-500' : ''}`}>
          {renderedLine}
        </div>
      );
    });
  };

  // Predefined Chat quick tags triggers
  const chatTemplateButtons = [
    { label: "🏨 Room Prices & Features", query: "What are the hotel room prices and features available?" },
    { label: "🥦 Shuddh Pure Veg Restaurant Menu", query: "Can you share the restaurant menu highlights, pricing, and timing?" },
    { label: "🚶 Distance to Kripalu Dham Temple Gate", query: "How far is local Rajeshwari Hotel from Mangarh Kripalu Dham Gate?" },
    { label: "🕒 Check-In & Check-Out Policies", query: "What is your check in and check out times? Do you offer power backup?" }
  ];

  // Lightbox navigational controls
  const handleNextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGalleryItems.length);
  };
  
  const handlePrevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredGalleryItems.length) % filteredGalleryItems.length);
  };

  return (
    <div id="hotel-app" className="min-h-screen bg-cream-100 flex flex-col font-sans selection:bg-maroon-100 selection:text-maroon-800 text-charcoal-800 antialiased overflow-x-hidden">
      
      {/* 1. STICKY PREMIUM HEADER */}
      <nav id="header-nav" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-maroon-700 text-cream-100 border-b-4 border-gold-500 shadow-xl py-3' 
          : 'bg-maroon-700/95 backdrop-blur-sm text-cream-100 border-b-4 border-gold-500 py-4 md:py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-md group-hover:bg-gold-600 transition-colors">
              <span className="font-serif font-bold text-xl text-maroon-700 leading-none">R</span>
            </div>
            <div>
              <h1 className="font-serif text-lg md:text-2xl leading-none font-bold uppercase tracking-wide text-cream-50">Rajeshwari</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-gold-400 opacity-90 block mt-0.5">Hotel & Restaurant • Kripalu Dham</p>
            </div>
          </a>

          {/* Desktop links navigation */}
          <div className="hidden lg:flex items-center space-x-8 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            {[
              { id: 'about', label: 'About' },
              { id: 'rooms', label: 'Rooms' },
              { id: 'restaurant', label: 'Menu' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'location', label: 'Location' },
              { id: 'booking', label: 'Book' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`transition-colors duration-200 hover:text-gold-500 cursor-pointer ${
                  activeSection === link.id ? 'text-gold-500 border-b-2 border-gold-500 pb-0.5' : 'text-cream-100'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a 
              href={`tel:${BUSINESS_INFO.phone}`} 
              className="flex items-center space-x-1.5 text-cream-100 border border-gold-500/30 px-3.5 py-1.5 rounded-sm hover:text-gold-500 hover:border-gold-500 transition-colors text-xs font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              <span>Call Desk</span>
            </a>
            <a
              href="#booking"
              className="bg-gold-500 text-maroon-700 hover:bg-gold-600 px-6 py-2 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              id="header-booking-btn"
            >
              Book Now
            </a>
          </div>

          {/* Mobile responsive toggler */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-cream-100 hover:bg-maroon-800 transition-colors"
            aria-label="Toggle navigation drawer menu"
            id="mobile-drawer-toggle"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-maroon-900 text-cream-50 border-b-4 border-gold-500 shadow-2xl px-5 py-6 flex flex-col space-y-4"
            id="mobile-navigation-panel"
          >
            {[
              { id: 'about', label: 'Welcome & About' },
              { id: 'rooms', label: 'Comfortable Rooms' },
              { id: 'restaurant', label: 'Veg Restaurant' },
              { id: 'amenities', label: 'Hotel Amenities' },
              { id: 'gallery', label: 'Photo Gallery' },
              { id: 'location', label: 'Location & Map' },
              { id: 'booking', label: 'Book Your Stay' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2 text-sm font-bold uppercase tracking-wider border-b border-maroon-800 transition-colors ${
                  activeSection === link.id ? 'text-gold-500 font-black' : 'text-cream-100 hover:text-gold-500'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center justify-center space-x-2 text-cream-100 border border-gold-500/40 px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-maroon-800 text-center flex-1"
              >
                <Phone className="w-5 h-5 text-gold-500" />
                <span>Call +91 90443 51480</span>
              </a>
              <a
                href="#booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-gold-500 text-maroon-700 hover:bg-gold-600 font-bold uppercase tracking-wider text-xs text-center px-4 py-3 rounded-sm block flex-1 transition-colors"
              >
                Book Stay Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 2. DYNAMIC SLIDER HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Rotating Images Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={heroSlides[currentHeroSlide].image}
                alt="Rajeshwari Hotel Banner"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/95 via-maroon-800/40 to-black/35 z-10" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-24 flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="bg-gold-500 text-maroon-900 px-4 py-1 rounded-sm text-xs font-bold uppercase tracking-widest shadow-md inline-block">
              🌟 Pure Vegetarian & Family Pilgrim Friendly
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-xl text-gold-100"
            id="hero-main-title"
          >
            Rajeshwari Hotel & Restaurant
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gold-400 font-serif italic text-lg sm:text-xl md:text-2xl font-medium mb-6 max-w-3xl drop-shadow-sm"
          >
            "{BUSINESS_INFO.tagline}"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-cream-100/90 text-sm sm:text-base md:text-lg mb-10 max-w-2xl leading-relaxed font-light"
          >
            {BUSINESS_INFO.subheading}
          </motion.p>

          {/* Quick Dual Highlights Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex gap-4 mb-10 w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-md p-3 border border-white/20 rounded-md flex-1 text-center">
              <p className="text-[10px] uppercase font-bold text-gold-500 mb-1 tracking-wider">Cleanliness</p>
              <p className="text-cream-100 text-sm font-medium">Hygienic Stay</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 border border-white/20 rounded-md flex-1 text-center">
              <p className="text-[10px] uppercase font-bold text-gold-500 mb-1 tracking-wider">Dining</p>
              <p className="text-cream-100 text-sm font-medium">Pure Vegetarian</p>
            </div>
          </motion.div>

          {/* Quick Stats Badges Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 mb-10 w-full max-w-4xl text-xs font-semibold"
          >
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-sm border border-white/10 flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>Kripalu Dham, Mangarh</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-sm border border-white/10 flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>+91 90443 51480</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-sm border border-white/10 flex items-center justify-center space-x-2">
              <Users className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>Family Friendly</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-sm border border-white/10 flex items-center justify-center space-x-2">
              <Star className="w-4 h-4 text-gold-500 flex-shrink-0 fill-gold-500" />
              <span>Clean Rooms</span>
            </div>
          </motion.div>

          {/* CTAs Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            id="hero-cta-group"
          >
            <a
              href="#booking"
              className="bg-gold-500 hover:bg-gold-600 text-maroon-800 px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-maroon-800" />
              <span>Book Stay Room</span>
            </a>
            <a
              href="#menu-card"
              className="bg-maroon-700 hover:bg-maroon-800 text-gold-500 border border-gold-500/20 px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center space-x-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>View Restaurant Menu</span>
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4 text-gold-500" />
              <span>Call Reception</span>
            </a>
          </motion.div>

          {/* Indicators dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentHeroSlide === idx ? 'bg-gold-500 w-8' : 'bg-white/35'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      
      {/* 3. ABOUT SECTION - WELCOME */}
      <section id="about" className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Pictures Collage Stack */}
            <div className="relative">
              <div className="aspect-video sm:aspect-square w-full rounded-sm overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/src/assets/images/hotel_exterior_1780800411363.png"
                  alt="Rajeshwari Hotel & Restaurant"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Overlaid Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-maroon-700 text-gold-100 p-5 rounded-sm shadow-2xl max-w-xs border-l-4 border-gold-500 hidden sm:block">
                <span className="font-serif text-3xl font-black block text-gold-500">2 Min</span>
                <span className="text-xs uppercase tracking-wider font-bold block text-cream-100">Walking Distance</span>
                <p className="text-xs text-cream-50/80 mt-1">To the holy Kripalu Dham, Mangarh temple gate!</p>
              </div>
            </div>

            {/* Written Copy Content */}
            <div className="flex flex-col">
              <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs mb-2 block border-l-2 border-gold-500 pl-2">
                Welcome & Family Hospitality
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight mb-6">
                Rajeshwari Hotel & Restaurant
              </h2>
              
              <p className="text-charcoal-800/90 mb-6 leading-relaxed text-base">
                Rajeshwari Hotel & Restaurant is a trusted premium destination for thousands of pilgrims, devotee groups, family tourists, and commercial travelers visiting Kripalu Dham and Mangarh. We take profound pride in serving sweet comforts, spotless physical upkeep, and exceptional delicacies.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { name: "Comfortable Rooms", desc: "Cozy spaces with modern AC, WiFi & hot water.", icon: Star },
                  { name: "Pure Vegetarian Dining", desc: "Shuddh Shakahari preparation with authentic taste.", icon: UtensilsCrossed },
                  { name: "Hygienic Environment", desc: "Rigorous daily housekeeping and sanitized washrooms.", icon: ShieldCheck },
                  { name: "Perfect Prime Location", desc: "Just minutes from Bhakti Mandir for early/late darshans.", icon: MapPin },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white border-l-4 border-maroon-700 p-4 rounded-sm flex space-x-3 items-start shadow-sm hover:border-gold-500 hover:shadow-md transition-all">
                      <div className="text-gold-500 mt-0.5">
                        <Icon className="w-5 h-5 text-gold-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal-800 text-sm sm:text-base">{item.name}</h4>
                        <p className="text-xs text-charcoal-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action and Landmark Info */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-beige-200 text-maroon-700 p-4 rounded-sm border-l-4 border-gold-500 shadow-sm">
                <div className="text-maroon-700 flex-shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <div className="text-center sm:text-left">
                  <h5 className="font-serif font-bold text-sm text-maroon-800 uppercase tracking-wider">Nearby Attraction Landmarks</h5>
                  <p className="text-xs text-charcoal-800 font-medium mt-1">{BUSINESS_INFO.landmark}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. ROOMS SECTION */}
      <section id="rooms" className="py-20 bg-cream-50 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans">
              Tranquil Stay Accommodations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight mb-4">
              Comfortable Stay for Every Pilgrim & Traveler
            </h2>
            <p className="text-charcoal-700 text-sm sm:text-base leading-relaxed font-light">
              Each room category is curated to establish a restful sanctuary, furnished with essential features, top plumbing hygiene, and dedicated staff backing 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ROOM_TYPES.map((room) => (
              <div 
                key={room.id}
                className="bg-white rounded-sm overflow-hidden border-l-4 border-maroon-700 hover:border-gold-500 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
                id={`room-card-${room.id}`}
              >
                {/* Room Photo */}
                <div className="relative aspect-video">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-maroon-700/95 text-gold-400 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {room.tag}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4 pb-2 border-b border-beige-200/55">
                      <h3 className="font-serif text-xl font-bold text-maroon-700">{room.name}</h3>
                      <div className="text-right">
                        <span className="text-[9px] text-charcoal-500 uppercase font-bold block tracking-wider">Starting At</span>
                        <span className="font-sans font-black text-maroon-700 text-xl">₹{room.price}</span>
                        <span className="text-[10px] text-charcoal-500 block">/night</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed mb-6 font-light">{room.description}</p>
                    
                    {/* Features list bullet checkboxes */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[10px] font-bold text-gold-600 block uppercase tracking-wider mb-2">Includes Conveniences:</span>
                      {room.features.slice(0, 5).map((f, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-charcoal-800">
                          <Check className="w-4 h-4 text-maroon-700 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-beige-200/55 flex space-x-2">
                    <button
                      onClick={() => handleRoomSelect(room.id)}
                      className="bg-maroon-700 hover:bg-maroon-800 text-gold-100 flex-1 py-3 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors text-center cursor-pointer shadow-sm"
                    >
                      Book Now
                    </button>
                    <a
                      href={`https://wa.me/919044351480?text=Namaste!%20I%20want%20to%2520know%20about%20the%2520the%20${room.name}%20availability.`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-3 rounded-sm flex items-center justify-center transition-all shadow-sm"
                      title="Enquire on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick trust strip */}
          <div className="mt-12 bg-maroon-700 text-cream-100 p-6 rounded-sm border-l-4 border-gold-500 shadow-xl flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
            <div className="flex items-center space-x-4">
              <Bookmark className="w-8 h-8 text-gold-500 flex-shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-gold-400">Devotee Group & Pilgrim Booking Package Deals</h4>
                <p className="text-xs text-cream-100/80 mt-1 max-w-2xl font-light">Planning an ashram event, pilgrimage group stay, or long parikrama stay? Contact us directly for deep group discounts.</p>
              </div>
            </div>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="bg-gold-500 text-maroon-900 hover:bg-gold-600 px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider flex-shrink-0 transition-colors shadow-md"
            >
              Get Custom Quote
            </a>
          </div>

        </div>
      </section>


      {/* 5. RESTAURANT SPOTLIGHT & INTERACTIVE MENU */}
      <section id="restaurant" className="py-20 bg-cream-100 border-t border-beige-200/30 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Written Spotlight description */}
            <div>
              <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans max-w-max">
                Dine-In Family Restaurant
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight mb-6">
                Authentic Taste, Memorable Dining Experience
              </h2>
              <p className="text-charcoal-800/85 text-sm sm:text-base mb-6 leading-relaxed">
                Step into <strong>Rajeshwari Restaurant</strong>, where our kitchens prepare delectable pure-vegetarian (Shuddh Shakahari) snacks, desserts, starters, and Chinese delicacies daily. We isolate preparation setups stringently, ensuring perfect purity and traditional culinary aesthetics honoring Kripalu Dham devotees.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "100% Pure Vegetarian Options",
                  "Mouth-watering Starters",
                  "Scrumptious Beverages",
                  "Spicy Chinese Classics",
                  "Family-Friendly Seating Space",
                  "Unrivaled hygiene standard"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-charcoal-800">
                    <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href="#menu-card"
                  className="bg-maroon-700 hover:bg-maroon-800 text-gold-100 px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  View Full Menu Below
                </a>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="bg-transparent text-maroon-700 border border-maroon-700/40 px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-maroon-50 transition-colors"
                >
                  Order Takeaway
                </a>
              </div>
            </div>

            {/* Premium Photo Grid Collage */}
            <div className="aspect-video lg:aspect-square w-full rounded-sm overflow-hidden shadow-xl border-4 border-white">
              <img
                src="/src/assets/images/restaurant_interior_1780800482310.png"
                alt="Rajeshwari Dining Area"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Interactive Menu subsection */}
          <div className="border-t border-beige-200/55 pt-16" id="menu-card">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-gold-600 font-bold uppercase tracking-widest text-xs block mb-1">Interactive Menu Card</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-700">Explore Rajeshwari Delicacies</h3>
              <p className="text-xs sm:text-sm text-charcoal-500 mt-2">Filter categories and search for your favorites in-house.</p>
            </div>

            {/* Filters, search and categorization controls */}
            <div className="bg-white p-4 rounded-sm border border-beige-200/80 mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm hover:border-gold-500 transition-colors">
              
              {/* Tabs buttons */}
              <div className="flex flex-wrap gap-1.5 justify-center w-full md:w-auto">
                {(['All', 'Beverages', 'Starters', 'Chinese', 'Soups'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedMenuCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedMenuCategory === category 
                        ? 'bg-maroon-700 text-gold-100 shadow-md font-black' 
                        : 'bg-cream-105 hover:bg-beige-200 text-charcoal-800 border border-beige-200/60'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search text filter input bar */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="text"
                  placeholder="Search dishes... (e.g. Paneer)"
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="w-full bg-cream-50 pl-10 pr-4 py-2.5 rounded-sm text-xs sm:text-sm font-medium border border-beige-200 hover:border-gold-300 focus:outline-none focus:border-maroon-700"
                />
                {menuSearchQuery && (
                  <button onClick={() => setMenuSearchQuery('')} className="absolute right-3.5 top-3.5 text-charcoal-500 hover:text-charcoal-800">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* Menu Items Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              <AnimatePresence mode="popLayout">
                {filteredMenuItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    key={item.id}
                    className="bg-white p-4 rounded-sm border-l-4 border-gold-500 hover:border-maroon-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2 pb-1.5 border-b border-beige-100">
                        <span className="text-[9px] font-bold text-maroon-700 tracking-wider bg-beige-200 px-2 py-0.5 rounded-sm uppercase font-sans">
                          {item.category}
                        </span>
                        {item.isPopular && (
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-maroon-100 text-maroon-700 px-2 py-0.5 rounded-sm flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-maroon-700" /> STAR DISH
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal-800 group-hover:text-maroon-700 transition-colors">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between border-t border-beige-200/50 pt-3 mt-4">
                      <span className="font-sans font-black text-maroon-700 text-sm sm:text-base">₹{item.price}</span>
                      <a
                        href={`https://wa.me/919044351480?text=Namaste!%20I%20want%20to%20order%20the%20${item.name}%20from%20the%20restaurant%20menu.`}
                        className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 bg-cream-50 hover:bg-maroon-700 hover:text-gold-100 px-2.5 py-1.5 rounded-sm border border-beige-200 transition-colors"
                      >
                        Order Now
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredMenuItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-charcoal-500 bg-white rounded-sm border border-beige-200 shadow-sm">
                  <UtensilsCrossed className="w-12 h-12 text-gold-500 mx-auto mb-3" />
                  <p className="font-serif font-bold text-sm sm:text-base text-charcoal-800">No dishes matched your keyword filters.</p>
                  <p className="text-xs mt-1">Try resetting the text filters or select another category tab above.</p>
                  <button 
                    onClick={() => { setSelectedMenuCategory('All'); setMenuSearchQuery(''); }}
                    className="mt-4 bg-maroon-700 hover:bg-maroon-800 text-gold-100 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider"
                  >
                    View All Items
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>


      {/* 6. AMENITIES SECTION */}
      <section id="amenities" className="py-20 bg-cream-50 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans">
              Modern Guest Conveniences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight mb-4">
              Designed for Comfort & Spiritual Serenity
            </h2>
            <p className="text-charcoal-700 text-sm sm:text-base leading-relaxed font-light">
              Our hospitality package incorporates robust power backups, CCTV networks, and supportive pilgrim layouts to ensure a calm, safe, and pleasant experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {AMENITIES.map((am, idx) => {
              const IconComponent = IconMap[am.icon] || Info;
              return (
                <div 
                  key={idx}
                  className="bg-white p-6 rounded-sm border-l-4 border-gold-500 shadow-md hover:border-maroon-700 hover:shadow-lg transition-all flex flex-col items-center text-center group"
                >
                  <div className="bg-maroon-700 text-gold-500 p-3.5 rounded-sm block mb-4 group-hover:scale-105 transition-transform shadow-sm">
                    <IconComponent className="w-5 h-5 text-gold-500" />
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal-800 mb-1">{am.name}</h3>
                  <p className="text-xs text-charcoal-500 font-light leading-relaxed">{am.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 7. WHY CHOOSE US COMPARISON SECTION */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-maroon-900 via-maroon-800 to-black text-gold-100 rounded-sm overflow-hidden shadow-2xl border-l-4 border-gold-500 p-8 md:p-12 lg:p-16 relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left promo box info */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-2">Perfect Devotional Stay</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                Why Devotees Prefer Rajeshwari Hotel?
              </h2>
              <p className="text-cream-100/80 text-sm leading-relaxed mb-6 font-light">
                Our property is engineered specifically to ensure a stress-free trip for families and elders arriving for pilgrimages at the holy Mangarh dham. We focus purely on security, hygiene, and holy hospitality.
              </p>
              
              <div className="flex gap-4">
                <a
                  href="#booking"
                  className="bg-gold-500 hover:bg-gold-600 text-maroon-900 px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider shadow-md transition-colors text-center"
                >
                  Book My Spot
                </a>
                <a
                  href={`https://wa.me/919044351480`}
                  className="bg-transparent border border-white/20 text-white hover:bg-white/10 px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-center transition-colors"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>

            {/* Right bullet lists reasons check */}
            <div className="lg:col-span-7 bg-black/30 p-6 sm:p-8 rounded-sm overflow-hidden flex flex-col justify-center space-y-4">
              {WHY_CHOOSE_US.map((reason, idx) => (
                <div key={idx} className="flex space-x-3 items-start bg-maroon-900/35 p-3 rounded-sm border-l-2 border-gold-500 shadow-sm">
                  <div className="text-gold-500 mt-0.5" id={`reason-${idx}`}>
                    <Check className="w-5 h-5 text-gold-500" />
                  </div>
                  <span className="text-xs sm:text-sm text-cream-100 font-medium font-sans leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* 8. CUSTOMER REVIEWS */}
      <section id="reviews" className="py-20 bg-cream-50 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans">
              Verified Guests Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight mb-4">
              What Our Visitors Say
            </h2>
            <p className="text-charcoal-700 text-sm sm:text-base font-light leading-relaxed">
              Listen to the actual experiences of pilgrims, couples, and traveling devotee families who stayed and dined at Rajeshwari Hotel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {REVIEWS.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white p-6 rounded-sm border-t-4 border-maroon-700 shadow-md hover:border-gold-500 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Star reviews rating display */}
                  <div className="flex space-x-1 mb-4 text-emerald-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-gold-500 text-gold-500 bg-none" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-beige-200/55 pt-4 mt-4">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-850">{rev.author}</h4>
                    <span className="text-[9px] text-maroon-700 uppercase tracking-widest font-bold block mt-0.5">{rev.role}</span>
                  </div>
                  <span className="text-[11px] font-medium text-charcoal-500 font-sans">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 9. PHOTO GALLERY WITH LIGHTBOX */}
      <section id="gallery" className="py-20 bg-cream-100 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
            <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans">
              The Visual Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight mb-4">
              Explore Our Galleries
            </h2>
            <p className="text-charcoal-700 text-sm sm:text-base font-light leading-relaxed">
              Take a curated virtual tour of our elegant property building exterior, cozy hotel suites, shakahari meals, and dinings.
            </p>
          </div>

          {/* Grid Category Selectors Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {['All', 'Hotel Exterior', 'Rooms', 'Restaurant', 'Dining Area', 'Food', 'Guests'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGalleryCategory(cat as any)}
                className={`px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm border ${
                  selectedGalleryCategory === cat 
                    ? 'bg-maroon-700 text-gold-100 border-maroon-800 font-black' 
                    : 'bg-white hover:bg-beige-200 text-charcoal-800 border-beige-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid Layout block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredGalleryItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-video sm:aspect-square bg-charcoal-900 border border-beige-200"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] text-gold-500 font-bold uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-white font-bold text-sm leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Lightbox Panel Overlay */}
          <AnimatePresence>
            {lightboxIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
                id="lightbox-container"
              >
                {/* Header controls bar */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-50">
                  <span className="text-xs sm:text-sm font-bold uppercase text-gold-500">
                    {filteredGalleryItems[lightboxIndex].category} ({lightboxIndex + 1} / {filteredGalleryItems.length})
                  </span>
                  <button 
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/35 transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Main image content layout */}
                <div className="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center">
                  
                  {/* Left button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrevLightbox(); }}
                    className="absolute left-2 sm:-left-16 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <motion.img
                    key={lightboxIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    src={filteredGalleryItems[lightboxIndex].url}
                    alt={filteredGalleryItems[lightboxIndex].title}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
                    referrerPolicy="no-referrer"
                  />

                  {/* Right button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNextLightbox(); }}
                    className="absolute right-2 sm:-right-16 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                </div>

                {/* Subtext description panel */}
                <div className="text-center text-white mt-4 max-w-2xl px-6">
                  <h3 className="text-gold-500 font-serif font-black text-lg sm:text-xl">
                    {filteredGalleryItems[lightboxIndex].title}
                  </h3>
                  <p className="text-xs text-cream-100/60 mt-2">
                    Rajeshwari Hotel & Restaurant • Kripalu Dham Mangarh Road
                  </p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 10. ONLINE ROOM BOOKING FORM WITH RECEIPT CALCULATIONS */}
      <section id="booking" className="py-20 bg-cream-50 border-t border-b border-beige-200/55 scroll-mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
            <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans">
              Instant Room Reservations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-700 tracking-tight mb-4">
              Book Your Stay
            </h2>
            <p className="text-charcoal-700 text-xs sm:text-sm font-light leading-relaxed">
              Complete the digital booking details below to instantly pre-register. To secure physical slot pre-clearance immediately, you can directly confirm details on WhatsApp.
            </p>
          </div>

          <div className="bg-white rounded-sm p-6 sm:p-10 border-l-4 border-gold-500 shadow-2xl hover:border-maroon-700 transition-colors" id="booking-panel">
            
            <AnimatePresence mode="wait">
              {!bookingResult ? (
                
                // MAIN BOOKING REQUEST INPUT FORM
                <motion.form
                  key="booking-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleBookingSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                    {/* Name input */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-500 tracking-wider mb-2">Guest Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={bookingInput.name}
                        onChange={(e) => setBookingInput({ ...bookingInput, name: e.target.value })}
                        className="w-full bg-cream-50 px-4 py-3 rounded-sm border border-beige-200 text-sm font-semibold focus:outline-none focus:border-maroon-700 focus:ring-1 focus:ring-maroon-750"
                      />
                    </div>

                    {/* Phone input */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-500 tracking-wider mb-2">Contact Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={bookingInput.phone}
                        onChange={(e) => setBookingInput({ ...bookingInput, phone: e.target.value })}
                        className="w-full bg-cream-50 px-4 py-3 rounded-sm border border-beige-200 text-sm font-semibold focus:outline-none focus:border-maroon-700 focus:ring-1 focus:ring-maroon-750"
                      />
                    </div>

                    {/* CheckIn date */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-500 tracking-wider mb-2">Check-In Date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={bookingInput.checkIn}
                          onChange={(e) => setBookingInput({ ...bookingInput, checkIn: e.target.value })}
                          className="w-full bg-cream-50 px-4 py-3 rounded-sm border border-beige-200 text-sm font-semibold focus:outline-none focus:border-maroon-700 focus:ring-1 focus:ring-maroon-750"
                        />
                      </div>
                    </div>

                    {/* CheckOut date */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-500 tracking-wider mb-2">Check-Out Date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={bookingInput.checkOut}
                          onChange={(e) => setBookingInput({ ...bookingInput, checkOut: e.target.value })}
                          className="w-full bg-cream-50 px-4 py-3 rounded-sm border border-beige-200 text-sm font-semibold focus:outline-none focus:border-maroon-700 focus:ring-1 focus:ring-maroon-750"
                        />
                      </div>
                    </div>

                    {/* Guests counts */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-500 tracking-wider mb-2">Number of Guests *</label>
                      <select
                        value={bookingInput.guests}
                        onChange={(e) => setBookingInput({ ...bookingInput, guests: parseInt(e.target.value) })}
                        className="w-full bg-cream-50 px-4 py-3 rounded-sm border border-beige-200 text-sm font-semibold focus:outline-none focus:border-maroon-700 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>{num} {num === 1 ? "Guest" : "Guests"}</option>
                        ))}
                      </select>
                    </div>

                    {/* Room Category dropdown */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-500 tracking-wider mb-2">Selected Accommodation Class *</label>
                      <select
                        value={bookingInput.roomType}
                        onChange={(e) => setBookingInput({ ...bookingInput, roomType: e.target.value })}
                        className="w-full bg-cream-50 px-4 py-3 rounded-sm border border-beige-200 text-sm font-semibold focus:outline-none focus:border-maroon-700 cursor-pointer"
                      >
                        {ROOM_TYPES.map((room) => (
                          <option key={room.id} value={room.id}>{room.name} — ₹{room.price}/night</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Special Requests textarea text */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal-500 tracking-wider mb-2">Special Demands / Requests (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Late night arrival from trains, ground floor requirement for senior citizens, extra mattress required..."
                      value={bookingInput.specialRequest}
                      onChange={(e) => setBookingInput({ ...bookingInput, specialRequest: e.target.value })}
                      className="w-full bg-cream-50 px-4 py-3 rounded-sm border border-beige-200 text-sm font-semibold focus:outline-none focus:border-maroon-700"
                    />
                  </div>

                  {/* Dynamic Stay Calculations Ticker strip */}
                  {stayCalculations && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-cream-50 p-5 rounded-sm border-l-4 border-gold-500 overflow-hidden shadow-sm"
                    >
                      <div className="flex justify-between items-center text-xs text-charcoal-500 font-bold uppercase tracking-wider mb-2">
                        <span>Rate Breakdown Summary</span>
                        <span>Estimated Calculations</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-1.5 font-sans">
                        <span className="font-semibold text-charcoal-800">Room Category:</span>
                        <span className="font-bold text-maroon-700 text-right">
                          {ROOM_TYPES.find(r => r.id === bookingInput.roomType)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-1.5 font-sans">
                        <span className="font-semibold text-charcoal-800">Nights Scheduled:</span>
                        <span className="font-bold text-charcoal-800 text-right">{stayCalculations.nights} {stayCalculations.nights === 1 ? "Night" : "Nights"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-3 pb-3 border-b border-beige-200">
                        <span className="font-semibold text-charcoal-800">Night Rate Cost:</span>
                        <span className="font-semibold text-charcoal-800 text-right">₹{stayCalculations.rate} / night</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-bold text-base text-maroon-800">Estimated Rental Charge:</span>
                        <span className="font-sans font-black text-2xl text-maroon-750 block">₹{stayCalculations.total}</span>
                      </div>
                      <p className="text-[9px] text-charcoal-500 mt-2 font-sans italic">* Prices exclude standard municipal tourist GST if applicable. Calculated pricing is finalized at reception desk.</p>
                    </motion.div>
                  )}

                  {/* Submit CTAs triggers buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isBookingSubmitting}
                      className="bg-maroon-700 hover:bg-maroon-800 text-gold-100 disabled:bg-maroon-100 disabled:text-maroon-700 py-4 px-8 rounded-sm font-bold text-xs sm:text-sm uppercase tracking-wider flex-1 transition-colors text-center shadow-md cursor-pointer block"
                    >
                      {isBookingSubmitting ? "Locking in Rooms..." : "Proceed to Pre-Register"}
                    </button>
                    
                    <a
                      href={`https://wa.me/919044351480?text=Namaste!%20I%20would%20like%20to%20book%20a%20stay.%20Please%20guide%20me.`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-sm text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-white" />
                      <span>WhatsApp Reservation</span>
                    </a>
                  </div>

                </motion.form>
              ) : (
                
                // BOOKING SUCCESS TICKET CARD RECEIPT DISPLAY
                <motion.div
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-sm border-2 border-dashed border-maroon-700 p-6 sm:p-8 shadow-lg flex flex-col items-center text-center relative"
                >
                  <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full mb-4">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-700 mb-1">Pre-Registration Confirmed!</h3>
                  <p className="text-xs text-charcoal-500 mb-6 font-light">Namaste, your stay request has been successfully pre-logged.</p>

                  {/* Core ticket summary box */}
                  <div className="bg-cream-50 text-left w-full rounded-sm border border-beige-200 p-5 mb-8 text-xs sm:text-sm space-y-3 font-sans">
                    <div className="flex justify-between border-b border-beige-200 pb-2.5">
                      <span className="font-bold text-maroon-750 uppercase tracking-widest text-[9px]">Reservation Code :</span>
                      <span className="font-mono font-black text-maroon-700 text-base">{bookingResult.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-charcoal-500">Primary Guest:</span>
                      <span className="font-bold text-charcoal-800">{bookingInput.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-charcoal-500">Contact Number:</span>
                      <span className="font-bold text-charcoal-800">{bookingInput.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-charcoal-500">Room Accommodation:</span>
                      <span className="font-bold text-maroon-700 text-sm">
                        {ROOM_TYPES.find(r => r.id === bookingInput.roomType)?.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-dashed border-beige-200">
                      <div>
                        <span className="text-[10px] uppercase text-charcoal-500 font-bold block">Check In Date</span>
                        <span className="font-bold text-charcoal-800 text-xs sm:text-sm">{bookingInput.checkIn}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-charcoal-500 font-bold block">Check Out Date</span>
                        <span className="font-bold text-charcoal-800 text-xs sm:text-sm">{bookingInput.checkOut}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-700 leading-relaxed mb-6 max-w-lg">
                    ⚠️ <strong>CRITICAL:</strong> Due to heavy pilgrimage flow in Mangarh Dham road, your booking has to be cleared. Click the prominent green button below to instantly submit details and receive reservation approvals via WhatsApp.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full font-sans">
                    <a
                      href={bookingResult.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-sm text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 flex-1 shadow-md transition-colors"
                      id="whatsapp-confirm-btn"
                    >
                      <MessageSquare className="w-5 h-5 text-white" />
                      <span>Confirm Stay via WhatsApp</span>
                    </a>
                    
                    <button
                      onClick={() => {
                        setBookingResult(null);
                        setBookingInput({
                          name: '',
                          phone: '',
                          checkIn: '',
                          checkOut: '',
                          guests: 1,
                          roomType: 'deluxe',
                          specialRequest: ''
                        });
                      }}
                      className="bg-cream-200 hover:bg-beige-200 text-charcoal-800 font-bold py-3.5 px-6 rounded-sm text-xs uppercase tracking-wider transition-colors border border-beige-200 cursor-pointer"
                    >
                      Book Another Room
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>


      {/* 11. LOCATION SECTION - EMBED MAP & DRIVING DIRECTIONS */}
      <section id="location" className="py-20 bg-cream-100 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Written address information details left panel */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans max-w-max">
                Perfect Pilgrim Hub
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight mb-6">
                Easy to Reach Location
              </h2>
              <p className="text-charcoal-800/80 text-sm sm:text-base mb-6 leading-relaxed font-light">
                Located right alongside the <strong>Mangarh Dham Road</strong>, we are adjacent to Kripalu Dham. This permits devotees to easily access temple parikramas and morning darshans, and enjoy late-night visual light shows at the mesmerizing <strong>Bhakti Mandir</strong> without long vehicle waits.
              </p>

              {/* Physical points lists */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5.5 h-5.5 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-800">Direct Street Address</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5 font-sans">{BUSINESS_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5.5 h-5.5 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-800">Operational Timing</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5 font-sans">{BUSINESS_INFO.hours}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Info className="w-5.5 h-5.5 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-800">Key Temple Landmark</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5 font-sans">{BUSINESS_INFO.landmark}</p>
                  </div>
                </div>
              </div>

              {/* CTA coordinates map buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={BUSINESS_INFO.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-maroon-700 hover:bg-maroon-800 text-gold-100 font-bold px-6 py-3.5 rounded-sm text-center text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4 text-gold-500" />
                  <span>Get Driving Directions</span>
                </a>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="bg-white hover:bg-cream-200 hover:border-gold-500 text-charcoal-800 font-bold px-6 py-3.5 rounded-sm text-center text-xs uppercase tracking-wider border border-beige-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4 text-gold-500" />
                  <span>Call Reception Desk</span>
                </a>
              </div>
            </div>

            {/* Embedded maps iframe frame panel right col */}
            <div className="lg:col-span-7 bg-white p-3 rounded-sm border border-beige-200 shadow-xl aspect-video lg:aspect-auto leading-none">
              <iframe
                title="Google Maps Location for Rajeshwari Hotel and Restaurant"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.3194098654855!2d81.38550181502251!3d25.7599026836371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399adcbe7a63d9ab%3A0xa1ea18df04bbef50!2sRajeshwari%20Hotel%20and%20Restaurant!5e0!3m2!1sen!2sin!4v1655184650123!5m2!1sen!2sin"
                className="w-full h-[300px] md:h-[420px] rounded-sm border-4 border-white shadow-md"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

        </div>
      </section>


      {/* 12. FAQ SECTION */}
      <section className="py-20 bg-cream-50 border-t border-b border-beige-200/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans">
              Frequently Asked Queries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-700 tracking-tight">
              Answering Guest Concerns
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-2 font-light">Get quick facts about accommodation rates, food rules, and directions guides.</p>
          </div>

          <div className="space-y-5 bg-white p-6 sm:p-10 rounded-sm border-l-4 border-gold-500 shadow-xl hover:border-maroon-700 transition-colors">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="pb-5 border-b border-beige-200/75 last:border-b-0 last:pb-0"
              >
                <h4 className="font-serif font-bold text-sm sm:text-base text-maroon-700 flex items-start space-x-2">
                  <span className="text-gold-500 font-black font-sans">Q.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-600 pl-4 mt-2 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 13. FLOATING COMFORT SMART CHATBOT ('ANANYA' AI ASSISTANT) */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {/* Toggle bubble button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-maroon-700 text-gold-500 hover:bg-maroon-800 p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all border border-gold-500/30 transform hover:scale-105 relative group animate-bounce opacity-95 hover:opacity-100"
          id="chat-toggle-bubble"
          aria-label="Open virtual AI assistance chat window"
        >
          {isChatOpen ? <X className="w-7 h-7 text-gold-500" /> : <MessageSquare className="w-7 h-7 text-gold-500" />}
          
          {/* Badge indicator */}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 bg-gold-500 text-maroon-900 font-black text-[9px] uppercase px-2 py-0.5 rounded-full border border-maroon-900 shadow-md">
              Ask AI
            </span>
          )}
        </button>

        {/* Chat Window Panel Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-[420px] h-[550px] bg-white rounded-sm border-t-4 border-maroon-700 shadow-2xl overflow-hidden flex flex-col z-50 border border-beige-300"
              id="ai-host-companion-panel"
            >
              
              {/* Chat Header information overlay */}
              <div className="bg-maroon-700 text-gold-100 p-4 flex items-center justify-between border-b border-gold-500/20">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-gold-500 p-2 rounded-sm text-maroon-900 font-serif font-bold text-sm shadow-sm flex items-center justify-center w-8 h-8">
                    R
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-gold-500">Ananya — Virtual AI Assistant</h4>
                    <span className="text-[10px] text-cream-100/70 block uppercase tracking-wider font-bold">Rajeshwari Hotel Host • Bilingual</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gold-500 hover:text-white p-1 rounded-sm"
                  title="Minimize chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat dialogue scrolling container list feed */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-cream-50" id="chat-messages-container">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-sm p-3 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-maroon-700 text-gold-100'
                        : 'bg-white text-charcoal-800 border-l-2 border-gold-500'
                    }`}>
                      <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                        {msg.role === 'model' ? formatTextWithBoldStyles(msg.text) : msg.text}
                      </div>
                      <span className={`text-[9px] text-right block mt-1.5 ${
                        msg.role === 'user' ? 'text-cream-100/60' : 'text-charcoal-500'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading indicator bubble */}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-charcoal-500 border-l-2 border-gold-500 rounded-sm p-3 shadow-sm flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px]">Drafting response...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Dynamic Quick Template replies suggestions buttons */}
              <div className="bg-cream-100/80 p-2.5 border-t border-b border-beige-200/50 flex flex-wrap gap-1.5 z-10 select-none">
                {chatTemplateButtons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(btn.query)}
                    className="bg-white hover:bg-beige-200 border border-beige-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-sm text-charcoal-800 shadow-sm cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Chat controls buttons typing block bar */}
              <div className="p-3 bg-white border-t border-beige-200/65 flex items-center space-x-2 font-sans">
                <input
                  type="text"
                  placeholder="Ask in English or Hindi..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  className="flex-grow bg-cream-50 pl-4 pr-2 py-2.5 rounded-sm text-xs sm:text-sm font-semibold border border-beige-200 focus:outline-none focus:border-maroon-700"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-maroon-700 text-gold-500 hover:bg-maroon-800 disabled:opacity-50 disabled:bg-maroon-100 p-2.5 rounded-sm flex items-center justify-center shadow-sm cursor-pointer"
                  title="Send input message"
                >
                  <Send className="w-4.5 h-4.5 text-gold-500" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* 14. COMPREHENSIVE CONTACT & CONTACT DETAILS CARDS */}
      <section className="py-20 bg-cream-100 border-t border-beige-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-maroon-700 font-bold uppercase tracking-widest text-xs bg-beige-200 px-3 py-1 rounded-sm mb-2 block border-b border-gold-500 font-sans">
              Direct Communication Channels
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 tracking-tight">
              Connect With Hospitality Desk
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-2 font-light">Our managers are ready to aid your queries 24/7. Call us, drop a mail, or stop by.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto font-sans">
            
            {/* Phone contact card */}
            <div className="bg-white p-6 py-8 rounded-sm border-l-4 border-gold-500 shadow-sm flex flex-col items-center text-center hover:border-maroon-700 transition-colors">
              <div className="bg-maroon-700 text-gold-500 p-3 rounded-sm block mb-4 shadow-sm w-12 h-12 flex items-center justify-center">
                <Phone className="w-6 h-6 text-gold-500" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal-800">Phone Contacts</h4>
              <p className="text-xs text-charcoal-500 mt-1 font-light">Book or enquire directly by Calling:</p>
              <a href={`tel:${BUSINESS_INFO.phone}`} className="font-mono font-black text-maroon-700 mt-3 text-sm sm:text-base hover:underline block">
                {BUSINESS_INFO.phone}
              </a>
            </div>

            {/* WhatsApp Contact card */}
            <div className="bg-white p-6 py-8 rounded-sm border-l-4 border-emerald-500 shadow-sm flex flex-col items-center text-center hover:border-maroon-700 transition-colors">
              <div className="bg-emerald-600 text-white p-3 rounded-sm block mb-4 shadow-sm w-12 h-12 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal-800">WhatsApp Chat</h4>
              <p className="text-xs text-charcoal-500 mt-1 font-light">Chat live with our booking reps:</p>
              <a 
                href={`https://wa.me/919044351480`} 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-black text-emerald-600 mt-3 text-sm sm:text-base hover:underline block"
              >
                +91 90443 51480
              </a>
            </div>

            {/* Email contact card */}
            <div className="bg-white p-6 py-8 rounded-sm border-l-4 border-gold-500 shadow-sm flex flex-col items-center text-center hover:border-maroon-700 transition-colors">
              <div className="bg-maroon-700 text-gold-500 p-3 rounded-sm block mb-4 shadow-sm w-12 h-12 flex items-center justify-center">
                <Send className="w-6 h-6 text-gold-500" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal-800">Email Address</h4>
              <p className="text-xs text-charcoal-500 mt-1 font-light">For corporate bookings, feedback:</p>
              <a href={`mailto:${BUSINESS_INFO.email}`} className="font-bold text-maroon-700 mt-3 text-xs sm:text-sm hover:underline hover:text-maroon-800 block break-all font-mono">
                {BUSINESS_INFO.email}
              </a>
            </div>

            {/* Hours Timing contact card */}
            <div className="bg-white p-6 py-8 rounded-sm border-l-4 border-maroon-700 shadow-sm flex flex-col items-center text-center hover:border-maroon-700 transition-colors">
              <div className="bg-maroon-700 text-gold-500 p-3 rounded-sm block mb-4 shadow-sm w-12 h-12 flex items-center justify-center">
                <Clock className="w-6 h-6 text-gold-500" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal-800">Business Hours</h4>
              <p className="text-xs text-charcoal-500 mt-1 font-light">Timing schedule models:</p>
              <span className="font-bold text-maroon-700 mt-3 text-xs sm:text-sm block">
                {BUSINESS_INFO.hours}
              </span>
            </div>

          </div>

        </div>
      </section>


      {/* 15. BRANDED FOOTER SECTION */}
      <footer className="bg-charcoal-900 text-white pt-16 pb-8 border-t-2 border-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gold-500 p-2 rounded-sm text-maroon-900 shadow-md">
                <span className="font-serif font-black text-xl leading-none block">R</span>
              </div>
              <div>
                <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-white block">Rajeshwari</span>
                <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold block -mt-1">Hotel & Restaurant</span>
              </div>
            </div>
            <p className="text-xs text-cream-100/60 leading-relaxed font-light">
              Premium hospitality venue situated next to Bhakti Mandir, Kripalu Dham, Mangarh. Comfortable rooms and outstanding 100% vegetarian culinary dishes matching your devotional travels stay.
            </p>
            <div className="flex space-x-3 text-xs pt-2">
              <span className="text-gold-500 font-bold">📍 Near Kripalu Dham Gate</span>
              <span className="text-gold-500 font-bold">⭐ Family Friendly</span>
            </div>
          </div>

          {/* Quick links col */}
          <div>
            <h4 className="font-serif text-gold-500 font-black text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-cream-100/60 font-medium">
              <li><a href="#about" className="hover:text-gold-500 transition-colors">Welcome & About Us</a></li>
              <li><a href="#rooms" className="hover:text-gold-500 transition-colors">Our Standard & Deluxe Rooms</a></li>
              <li><a href="#restaurant" className="hover:text-gold-500 transition-colors">Pure Veg Dining Features</a></li>
              <li><a href="#menu-card" className="hover:text-gold-500 transition-colors">Interactive Menu Card</a></li>
              <li><a href="#gallery" className="hover:text-gold-500 transition-colors">Photos & Rooms Gallery</a></li>
              <li><a href="#booking" className="hover:text-gold-500 transition-colors">Book Your Stay Room</a></li>
            </ul>
          </div>

          {/* Room Categories col */}
          <div>
            <h4 className="font-serif text-gold-500 font-black text-sm tracking-wider uppercase mb-4">Stay & Dining</h4>
            <ul className="space-y-2 text-xs text-cream-100/60 font-medium font-mono">
              <li><a href="#rooms" className="hover:text-gold-500 transition-colors">Deluxe Executive Room — (₹1500)</a></li>
              <li><a href="#rooms" className="hover:text-gold-500 transition-colors">Family Suite / Multi-bed — (₹2500)</a></li>
              <li><a href="#rooms" className="hover:text-gold-500 transition-colors">Standard Budget Room — (₹1000)</a></li>
              <li><a href="#menu-card" className="hover:text-gold-500 transition-colors">Beverages & Sweet Coffee</a></li>
              <li><a href="#menu-card" className="hover:text-gold-500 transition-colors">Snacks & Starters Platter</a></li>
              <li><a href="#menu-card" className="hover:text-gold-500 transition-colors">Vegetarian Soups</a></li>
            </ul>
          </div>

          {/* Info Address col */}
          <div>
            <h4 className="font-serif text-gold-500 font-black text-sm tracking-wider uppercase mb-4">Our Coordinates</h4>
            <p className="text-xs text-cream-100/60 leading-relaxed mb-4">
              Mangarh Dham Road, Kripalu Dham, Mangarh, Kunda, Pratapgarh, Uttar Pradesh, 230129 (Just 2 min from Bhakti Mandir entrance gate).
            </p>
            <div className="space-y-2 font-mono text-xs">
              <span className="block text-cream-100/80">📞 Phone: +91 90443 51480</span>
              <span className="block text-cream-100/80">💬 WhatsApp: +91 90443 51480</span>
              <a 
                href={BUSINESS_INFO.mapsLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gold-500 hover:underline flex items-center space-x-1 font-sans font-bold"
              >
                <ExternalLink className="w-4.5 h-4.5 inline" />
                <span>View Google Maps Link</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright stamp */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-white/5 text-center text-xs text-cream-100/40">
          <p>© 2026 Rajeshwari Hotel & Restaurant, Mangarh Kripalu Dham. All rights reserved. Designed for supreme pilgrim hospitality.</p>
          <div className="flex justify-center space-x-4 mt-2 font-semibold">
            <span className="text-[10px] uppercase text-gold-500/70">Atithi Devo Bhava</span>
            <span className="text-white/20">|</span>
            <span className="text-[10px] uppercase text-gold-500/70">Shuddh Vegetarian</span>
            <span className="text-white/20">|</span>
            <span className="text-[10px] uppercase text-gold-500/70">Mangarh Dham road, Kripalu Dham</span>
          </div>
        </div>

      </footer>

    </div>
  );
}

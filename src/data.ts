/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, RoomType, Review, GalleryItem } from './types';

export const BUSINESS_INFO = {
  name: "Rajeshwari Hotel & Restaurant",
  tagline: "Comfortable Stay • Delicious Food • Family Hospitality",
  subheading: "Experience warm hospitality, clean rooms, authentic cuisine, and a peaceful stay just minutes from Kripalu Dham.",
  address: "Mangarh Dham Road, Kripalu Dham, Mangarh, Kunda, Pratapgarh, Uttar Pradesh, 230129",
  phone: "+91 90443 51480",
  whatsapp: "+91 90443 51480",
  email: "rajeshwarihotelmangarh@gmail.com",
  hours: "Hotel: 24/7 | Restaurant: 8:00 AM - 11:00 PM",
  mapsLink: "https://maps.google.com/?q=Rajeshwari+Hotel+and+Restaurant+Mangarh+Kripalu+Dham",
  landmark: "Just 2 minutes working distance from Kripalu Dham Temple gate",
};

export const ROOM_TYPES: RoomType[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    price: 1500,
    description: "Premium single-room accommodation with contemporary warm-lit wooden interiors, custom plush settings, and standard executive comforts.",
    features: [
      "Queen Size Bed",
      "Premium Air Conditioning (AC)",
      "Attached Modern Bathroom",
      "High-speed Free WiFi",
      "Flat Screen LCD TV",
      "Hygienic Toiletries",
      "24/7 Room Service"
    ],
    image: "/src/assets/images/room_deluxe_1780800430158.png",
    amenities: ["AC", "WiFi", "TV", "Hot Water", "Room Service"],
    tag: "Most Popular for Couples & Executives"
  },
  {
    id: "family",
    name: "Family Room / Suite",
    price: 2500,
    description: "Extra spacious multi-bed accommodation specially designed for pilgrim groups, large families, and tourists traveling together.",
    features: [
      "Multiple Comfort Beds (Double + Single Layout)",
      "Spacious Living and Seating Area",
      "Premium Air Conditioning (AC)",
      "Attached Elegant bathroom",
      "Flat Screen TV & High-speed WiFi",
      "Dresser & Wardrobe",
      "Extra mattresses on request"
    ],
    image: "/src/assets/images/room_family_1780800446665.png",
    amenities: ["AC", "WiFi", "TV", "Hot Water", "Family Space", "Room Service"],
    tag: "Best for Pilgrims & Families"
  },
  {
    id: "standard",
    name: "Standard Room",
    price: 1000,
    description: "Extremely tidy, budget-friendly room providing cozy bedding, tranquil atmosphere, and clean arrangements.",
    features: [
      "Comfortable Double Bed",
      "Tidy Linens & Spotless Blankets",
      "Attached Bathroom",
      "Free High-speed WiFi",
      "Efficient Cooler / Fan",
      "24/7 Support Staff Desk",
      "Perfect Budget Stay"
    ],
    image: "/src/assets/images/room_standard_1780800465155.png",
    amenities: ["Cooler", "WiFi", "Hot Water", "Clean Linens"],
    tag: "Value for Money"
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Beverages
  { id: "bev1", name: "Hot Coffee", price: 60, category: "Beverages", isPopular: true },
  { id: "bev2", name: "Black Coffee", price: 40, category: "Beverages" },
  { id: "bev3", name: "Cold Coffee", price: 90, category: "Beverages" },
  { id: "bev4", name: "Cold Coffee with Ice Cream", price: 120, category: "Beverages", isPopular: true },
  { id: "bev5", name: "Cold Drink", price: 20, category: "Beverages" },
  { id: "bev6", name: "Masala Cold Drink", price: 50, category: "Beverages" },
  { id: "bev7", name: "Fresh Lime Water", price: 60, category: "Beverages" },
  { id: "bev8", name: "Fresh Lime Soda", price: 70, category: "Beverages" },

  // Starters
  { id: "star1", name: "Paneer Tikka", price: 199, category: "Starters", isPopular: true },
  { id: "star2", name: "Paneer Angara", price: 199, category: "Starters" },
  { id: "star3", name: "Paneer Malai Tikka", price: 220, category: "Starters", isPopular: true },
  { id: "star4", name: "Paneer Stuffed Tikka", price: 220, category: "Starters" },
  { id: "star5", name: "Mushroom Tikka", price: 199, category: "Starters" },
  { id: "star6", name: "Crispy Mushroom", price: 199, category: "Starters" },
  { id: "star7", name: "Crispy Corn", price: 149, category: "Starters" },
  { id: "star8", name: "Veg Seekh Kabab", price: 169, category: "Starters" },
  { id: "star9", name: "Veg Sami Kabab", price: 179, category: "Starters" },
  { id: "star10", name: "Veg Sandwich", price: 99, category: "Starters" },
  { id: "star11", name: "Veg Grilled Sandwich", price: 119, category: "Starters" },
  { id: "star12", name: "Chilli Potato", price: 129, category: "Starters" },
  { id: "star13", name: "Honey Chilli Potato", price: 149, category: "Starters", isPopular: true },
  { id: "star14", name: "Veg Cutlet", price: 99, category: "Starters" },
  { id: "star15", name: "Paneer Cutlet", price: 119, category: "Starters" },

  // Chinese
  { id: "chin1", name: "Veg Burger", price: 89, category: "Chinese" },
  { id: "chin2", name: "Paneer Burger", price: 99, category: "Chinese" },
  { id: "chin3", name: "Cheese Burger", price: 119, category: "Chinese", isPopular: true },
  { id: "chin4", name: "French Fries", price: 80, category: "Chinese" },
  { id: "chin5", name: "Cheese Fries", price: 89, category: "Chinese" },
  { id: "chin6", name: "Veg Chowmein", price: 120, category: "Chinese" },
  { id: "chin7", name: "Chinese Choupsey", price: 150, category: "Chinese" },
  { id: "chin8", name: "Veg Noodles", price: 100, category: "Chinese" },
  { id: "chin9", name: "Paneer Noodles", price: 130, category: "Chinese" },
  { id: "chin10", name: "Hakka Noodles", price: 150, category: "Chinese" },
  { id: "chin11", name: "Singapore Noodles", price: 170, category: "Chinese" },
  { id: "chin12", name: "American Noodles", price: 150, category: "Chinese" },
  { id: "chin13", name: "Rajeshwari Special Noodles", price: 180, category: "Chinese", isPopular: true },
  { id: "chin14", name: "Veg Manchurian Dry/Gravy", price: 180, category: "Chinese" },
  { id: "chin15", name: "Paneer Dry/Gravy", price: 200, category: "Chinese" },
  { id: "chin16", name: "Veg Fried Rice", price: 150, category: "Chinese" },
  { id: "chin17", name: "Paneer Fried Rice", price: 170, category: "Chinese" },
  { id: "chin18", name: "Schezwan Fried Rice", price: 180, category: "Chinese" },
  { id: "chin19", name: "Rajeshwari Special Fried Rice", price: 200, category: "Chinese", isPopular: true },

  // Soups
  { id: "soup1", name: "Veg Soup", price: 69, category: "Soups" },
  { id: "soup2", name: "Tomato Soup", price: 69, category: "Soups" },
  { id: "soup3", name: "Veg Manchow Soup", price: 79, category: "Soups", isPopular: true },
  { id: "soup4", name: "Sweet Corn Soup", price: 79, category: "Soups" },
  { id: "soup5", name: "Hot & Sour Soup", price: 89, category: "Soups" },
  { id: "soup6", name: "Mushroom Soup", price: 89, category: "Soups" },
  { id: "soup7", name: "Lemon Coriander Soup", price: 89, category: "Soups", isPopular: true },
  { id: "soup8", name: "Veg Clear Soup", price: 99, category: "Soups" }
];

export const AMENITIES = [
  { name: "Free WiFi", desc: "Stay connected always", icon: "Wifi" },
  { name: "Ample Parking", desc: "Secure in-premises setup", icon: "ParkingSquare" },
  { name: "Room Service", desc: "Just a bell ring away", icon: "Bell" },
  { name: "Family Dining", desc: "Hygienic Pure-Veg restaurant", icon: "UtensilsCrossed" },
  { name: "24/7 Hot Water", desc: "Constant warm running water", icon: "Droplet" },
  { name: "CCTV Security", desc: "Round-the-clock safety tracking", icon: "ShieldCheck" },
  { name: "Power Backup", desc: "Uninterrupted lighting & charging", icon: "Cpu" },
  { name: "Pilgim Guides", desc: "Assistance to Kripalu Dham Temple", icon: "MapPin" }
];

export const WHY_CHOOSE_US = [
  "🚶 Just a 2-minute walking distance from Kripalu Dham, Mangarh Temple Gate",
  "🧼 Stringent triple-hygiene check for all rooms and public lounges",
  "🥦 100% Pure Vegetarian kitchen handling authentic food separate from cross-contaminations",
  "💰 Highly competitive, honest, transparent prices with no hidden charges",
  "👨‍👩‍👧‍👦 Peaceful, holy, and safe family atmosphere suitable for senior citizens & children",
  "🤝 Exceptionally warm-hearted, courteous, and locals-trained polite helpers",
  "🕒 High-speed booking setup via WhatsApp with real-time room configuration queries"
];

export const REVIEWS: Review[] = [
  {
    id: "rev1",
    author: "Pandey Gaurav",
    rating: 5,
    comment: "Excellent food and extraordinarily hygienic and clean rooms. It is the perfect spot to stay with family when visiting the Kripalu Dham. The staff is highly respectful and and the restaurant serves fresh, delicious pure vegetarian food.",
    date: "2026-05-18",
    role: "Family Pilgrim Visitor"
  },
  {
    id: "rev2",
    author: "Shalini Sharma",
    rating: 5,
    comment: "The family-friendly dining environment was extremely pleasant. We tried Paneer Malai Tikka and special noodles, they were delicious! The hotel rooms are affordable and extremely peaceful. Highly recommended!",
    date: "2026-05-29",
    role: "Regular Tourist"
  },
  {
    id: "rev3",
    author: "Ravi K. Mishra",
    rating: 5,
    comment: "Superb experience! Located right on the Mangarh road, walking distance from temple. Best budget rates with AC standard rooms, backup generator was running perfectly, clean bathroom, clean sheets and delicious hot beverages.",
    date: "2026-06-03",
    role: "Devotee Visitor"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal1",
    category: "Hotel Exterior",
    title: "Rajeshwari Hotel Front Facade",
    url: "/src/assets/images/hotel_exterior_1780800411363.png"
  },
  {
    id: "gal2",
    category: "Rooms",
    title: "Spacious Premium Deluxe Room",
    url: "/src/assets/images/room_deluxe_1780800430158.png"
  },
  {
    id: "gal3",
    category: "Rooms",
    title: "Pilgrim-Ideal Multi-Bed Family Suite",
    url: "/src/assets/images/room_family_1780800446665.png"
  },
  {
    id: "gal4",
    category: "Rooms",
    title: "Spotless Cozy Budget Standard Room",
    url: "/src/assets/images/room_standard_1780800465155.png"
  },
  {
    id: "gal5",
    category: "Restaurant",
    title: "Rajeshwari Restaurant Family Dining Space",
    url: "/src/assets/images/restaurant_interior_1780800482310.png"
  },
  {
    id: "gal6",
    category: "Food",
    title: "Delicious Paneer Platters and Snacks",
    url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "gal7",
    category: "Dining Area",
    title: "Cozy Warm Dynamic Interior Tables",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "gal8",
    category: "Guests",
    title: "Happy Families Sharing Hospitality",
    url: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=600&auto=format&fit=crop"
  }
];

export const FAQS = [
  {
    q: "How far is Rajeshwari Hotel & Restaurant from the Kripalu Dham Temple?",
    a: "We are ideally situated on the main Mangarh Dham Road, which lies at exactly 2 minutes comfortable walking distance from the main entrance gate of Kripalu Dham, Mangarh."
  },
  {
    q: "Do you have 100% Pure Vegetarian dishes?",
    a: "Yes! Our restaurant is fully pure-vegetarian (Shuddh Shakahari). All our cooks are highly trained, using clean ingredients completely separate from non-vegetarian items."
  },
  {
    q: "Can we book a room via WhatsApp?",
    a: "Absolutely! Group booking, pilgrims booking, and quick queries can all be easily verified and transacted by clicking our WhatsApp Booking CTA. We will reply instantly."
  },
  {
    q: "Is there CCTV safety security and power backup?",
    a: "Yes, we prioritize Pilgrim and Family safety. The entire property is equipped with 24/7 CCTV camera coverage, and we have automated high-wattage power generator backup so you never stay in the dark."
  },
  {
    q: "What is your Check-In and Check-Out policy?",
    a: "Our standard check-in time is 12:00 PM and check-out is 11:00 AM, but we happily provide flexible shifts for pilgrims coming from long train journeys or late night arrivals, based on room availability."
  }
];

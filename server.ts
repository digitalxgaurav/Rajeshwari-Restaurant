/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Parse JSON payloads
app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined or is placeholder. Chat AI will use local fallback answers.");
}

// System Instruction for the AI Hotel Companion
const HOSPITALITY_SYSTEM_PROMPT = `
You are 'Ananya', the warm, professional, and friendly virtual assistant of Rajeshwari Hotel & Restaurant, located near Kripalu Dham, Mangarh, Kunda, Uttar Pradesh, India.
Your goal is to provide exceptional Indian hospitality (Atithi Devo Bhava) and answer questions regarding our hotel rooms, restaurant menu, booking protocols, location, and the holy Kripalu Dham temple.

Here is your knowledge base:
1. Contact Details:
   - Phone & WhatsApp: +91 90443 51480
   - Email: rajeshwarihotelmangarh@gmail.com
   - Address: Mangarh Dham Road, Kripalu Dham, Mangarh, Kunda, Pratapgarh, Uttar Pradesh (Near Bhakti Mandir entrance gate).
   - Landmark: Just a 2-minute comfortable walking distance from Kripalu Dham Temple gate. Extremely easy for pilgrims!

2. Accommodation (Hotel Rooms):
   - Deluxe Room (₹1500/night): Features a Queen-size bed, AC, Attached modern bathroom, flat screen LCD TV, high-speed free WiFi, spotless toiletries, and 24/7 room service. Perfect for couples or single executives.
   - Family Room / Suite (₹2500/night): Extra spacious. Features multiple beds (double + single setup), spacious living area, AC, attached modern bathroom, wardrobes, free WiFi. Perfect for group travelers, devotees, and large families.
   - Standard Room (₹1000/night): Clean budget-friendly room, double bed, clean sheets, air cooler/fan, attached bathroom, high speed WiFi. Best value for money.
   - Policies: 12:00 PM check-in, 11:00 AM check-out. Flexible timings for pilgrims arriving by trains can be arranged.

3. Dining & Restaurant (Rajeshwari Restaurant):
   - Cuisine: 100% Pure Vegetarian (Shuddh Shakahari) separately maintained kitchen.
   - Categories: Beverages, Starters, Chinese, and Indian Soups.
   - Top Beverages: Hot Coffee (₹60), Cold Coffee with Ice Cream (₹120), Fresh Lime Soda (₹70), Masala Cold Drink (₹50).
   - Top Starters: Paneer Tikka (₹199), Paneer Malai Tikka (₹220), Honey Chilli Potato (₹149), Veg Seekh Kabab (₹169), Veg Grilled Sandwich (₹119).
   - Chinese Specialties: Veg Burger (₹89), Rajeshwari Special Noodles (₹180), Veg Manchurian Dry/Gravy (₹180/₹200), Rajeshwari Special Fried Rice (₹200).
   - Soups: Tomato Soup (₹69), Veg Manchow Soup (₹79), Lemon Coriander Soup (₹89).
   - Ambience: Cozy, warm cream colors, highly clean, pristine tables, quick service, absolutely family-friendly.

4. Guest Conveniences:
   - 24/7 Power Backup (Automated generator), Secure CCTV tracking, Free parking inside premises, Free high-speed WiFi, Hot running water, Pilgrim guidance assistance.

5. Temple Info (Mangarh / Kripalu Dham):
   - Kripalu Dham Mangarh is the birthplace of Jagadguru Shri Kripalu Ji Maharaj. It houses the magnificent Bhakti Mandir temple, a spectacular marble monument.
   - Visitors love of Bhakti Mandir: daily darshan, morning/evening aarti, light show, musical fountains, and divine atmosphere.
   - We are the premium hotel nearest to this temple, making us the top choice to avoid long commuting!

CONVERSATIONAL GUIDELINES:
- Conversational tone: Delightful, polite, culturally respectful, humble, and guest-centric.
- Language: Speak in the language the customer uses. You are fully bilingual: English, Hindi, and Hinglish (Hindi written in Roman characters). For example, if they greet you with "Namaste" or "Room prices kya hain?", reply in highly conversational Hindi/Hinglish!
- Clear & concise: Keep responses friendly and sweet. Avoid bloated technical jargon.
- Booking action: If guest wants to book or inquires about booking block, guide them to fill out the "Book Your Stay" form in our webpage layout or click "WhatsApp Booking" to chat with support instantly at +91 90443 51480.
`;

// API: Booking submission
app.post('/api/book', (req, res) => {
  const { name, phone, checkIn, checkOut, guests, roomType, specialRequest } = req.body;

  if (!name || !phone || !checkIn || !checkOut || !roomType) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  // Generate unique booking confirmation code
  const bookingId = "RHR-" + Math.floor(100000 + Math.random() * 900000);

  // Formulate WhatsApp redirect message
  const preFilledText = `Namaste Rajeshwari Hotel! I would like to confirm my booking.
Booking ID: ${bookingId}
Name: ${name}
Phone: ${phone}
Check-In: ${checkIn}
Check-Out: ${checkOut}
Guests: ${guests}
Room Category: ${roomType}
Request: ${specialRequest || "None"}`;

  const encodedMsg = encodeURIComponent(preFilledText);
  const whatsappUrl = `https://wa.me/919044351480?text=${encodedMsg}`;

  // Simply mock successful transaction in local memory log and return payload
  console.log(`[BOOKING SUCCESS] ID: ${bookingId}, Guest Name: ${name}, Phone: ${phone}`);

  return res.json({
    success: true,
    bookingId,
    whatsappUrl,
    message: "Your initial request has been registered. Please click 'Confirm on WhatsApp' to secure your rooms immediately."
  });
});

// API: Gemini chat agent
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array sequence." });
  }

  // Prepare messages into standard contents structure for Gemini SDK
  const lastUserMessage = messages[messages.length - 1];
  if (!lastUserMessage || !lastUserMessage.text) {
    return res.status(400).json({ error: "No user text content detected." });
  }

  // Helper for generating fallback responses in case of key absence or model unavailability
  function getLocalFallbackResponse(rawQuery: string): string {
    const query = (rawQuery || "").toLowerCase().trim();
    
    if (query.includes("room") || query.includes("room rate") || query.includes("kamra") || query.includes("price") || query.includes("kiraya") || query.includes("category") || query.includes("cost") || query.includes("rent")) {
      return "Our Room Rates & Categories:\n\n" +
             "1. Deluxe Room (₹1500/night): Features a Queen-size bed, AC, flat screen Smart LCD TV, high-speed free WiFi, spotless premium toiletries, and 24/7 dedicated room service. Perfect for couples or single executives.\n" +
             "2. Family Room / Suite (₹2500/night): Extra spacious multi-bed suite with comfy double + single setups, visual wardrobe, and modern cooling facilities. Ideal for group pilgrims and large families.\n" +
             "3. Standard Bed (₹1000/night): Clean, budget-friendly fan/cooler room offering essential double bed comfort, high-speed WiFi, and complete hygiene.\n\n" +
             "To book, you can submit the Reservation Form on our homepage, or click 'WhatsApp Booking' to chat directly with our staff!";
    }
    
    if (query.includes("menu") || query.includes("food") || query.includes("khan") || query.includes("restaurant") || query.includes("paneer") || query.includes("lunch") || query.includes("dinner") || query.includes("breakfast") || query.includes("eating") || query.includes("special") || query.includes("dish")) {
      return "Rajeshwari Restaurant serves 100% Shuddh Shakahari (Pure Vegetarian) delicacies in an extremely clean and family-friendly setting.\n\n" +
             "- Top Starters: Paneer Tikka (₹199), Paneer Malai Tikka (₹220), Veg Seekh Kabab (₹169), Veg Grilled Sandwich (₹119)\n" +
             "- Chinese & Noodles: Veg Burger (₹89), Rajeshwari Special Noodles (₹180), Veg Manchurian (₹180-₹200)\n" +
             "- Indian Soups: Tomato Soup (₹69), Veg Manchow Soup (₹79), Lemon Coriander Soup (₹89)\n" +
             "- Hot & Cold Beverages: Fresh Lime Soda (₹70), Hot Brew Coffee (₹60), Cold Coffee with Ice Cream (₹120).\n\n" +
             "Feel free to select items filters under our 'Culinary' section on the homepage!";
    }
    
    if (query.includes("distance") || query.includes("mangarh") || query.includes("kripalu") || query.includes("bhakti") || query.includes("temple") || query.includes("how to reach") || query.includes("location") || query.includes("address") || query.includes("map") || query.includes("reach") || query.includes("route")) {
      return "We are located directly adjacent to Kripalu Dham on the Mangarh Dham Road!\n\n" +
             "- Perfect walking convenience: We are just a 2-minute comfortable stroll from the main entry gates of the magnificent Bhakti Mandir temple.\n" +
             "- Ground parking: Safe parking space inside our premises is absolutely free for all lodging and restaurant guests.\n" +
             "- Public routes: If you arrive from Kunda Harinamganj Railway Station (7 km) or Prayagraj/Lucknow airports, local cabs can drop you right at our doorstep.\n\n" +
             "For turn-by-turn navigation, click the 'Get Driving Directions' button under our map section!";
    }
    
    if (query.includes("contact") || query.includes("phone") || query.includes("number") || query.includes("whatsapp") || query.includes("call") || query.includes("email") || query.includes("reception") || query.includes("manager") || query.includes("connect")) {
      return "You can connect with the Rajeshwari Hotel Hospitality Desk instantly:\n\n" +
             "• Direct Phone Call: +91 90443 51480\n" +
             "• Live Chat on WhatsApp: +91 90443 51480\n" +
             "• Corporate/General Email: rajeshwarihotelmangarh@gmail.com\n" +
             "• Physical Helpdesk: Available 24/7 in our main lobby.\n\n" +
             "Our receptionists are happy to assist your travels anytime!";
    }

    if (query.includes("book") || query.includes("reserve") || query.includes("stay") || query.includes("booking") || query.includes("checkin") || query.includes("checkout") || query.includes("policy") || query.includes("time") || query.includes("timing")) {
      return "Booking Details & Policies:\n\n" +
             "- Standard Check-In: 12:00 PM | Standard Check-Out: 11:00 AM. We offer flexible check-in adjustments for pilgrims arriving by late night or early morning trains.\n" +
             "- To Book: Just input your basic dates and guest count in our clean online reservation calculator. After calculating the total estimated booking charge, hit 'Confirm on WhatsApp' to secure your lock-in instantly!\n" +
             "- Direct alternative: You can also call us directly at +91 90443 51480 for telephone confirmations.";
    }

    if (query.includes("amenities") || query.includes("wifi") || query.includes("ac") || query.includes("facilities") || query.includes("parking") || query.includes("service") || query.includes("cooler") || query.includes("water") || query.includes("power")) {
      return "Rajeshwari Hotel is fully equipped with everything a traveling devotee expects for a comfortable stay:\n\n" +
             "• 24/7 Power Backup with automatic generating engines.\n" +
             "• High-speed secure WiFi throughout the hotel blocks.\n" +
             "• Free, safe private parking inside the hotel gates.\n" +
             "• Round-the-clock room service and friendly pilgrim guidance.\n" +
             "• Attached clean bathrooms with running hot water showers.\n" +
             "• Constant 24/7 CCTV vigilance safety monitoring.";
    }

    if (query.includes("hello") || query.includes("hi") || query.includes("namaste") || query.includes("hey") || query.includes("greeting") || query.includes("who are you") || query.includes("name") || query.includes("ananya")) {
      return "Namaste! Welcome to Rajeshwari Hotel & Restaurant, Mangarh. 🙏 I am Ananya, your dedicated Virtual AI Assistant.\n\n" +
             "I am here to ensure you have a beautiful visit. I can help answer queries about our pure veg menu, AC room options starting from ₹1000/night, coordinates next to Bhakti Mandir, and quick room reservations.\n\n" +
             "What can I help you discover regarding your upcoming pilgrim stay?";
    }

    // Default, highly detailed informational response
    return "Namaste! I am Ananya, your helpful Assistant at Rajeshwari Hotel & Restaurant, located near Bhakti Mandir, Kripalu Dham, Mangarh.\n\n" +
           "Here are some quick highlights:\n" +
           "• Comfort Stay: Quality Rooms ranging from ₹1000/night (Standard) to ₹1500 (Deluxe AC) and ₹2500 (Spacious Family Suite).\n" +
           "• Pure Veg Restaurant: Shuddh Shakahari kitchen serving delicious starters (Paneer Tikka, Veg Seekh), Chinese, and drinks.\n" +
           "• Location Priority: A simple 2-minute walking distance (very close!) from Kripalu Dham main entrance gate.\n" +
           "• Contact: Call or WhatsApp us anytime at +91 90443 51480.\n\n" +
           "Please let me know if you would like me to discuss our rooms, menu items, directions, or booking steps!";
  }

  // Local fallback triggers in case of missing or broken Gemini API Key
  if (!ai) {
    const reply = getLocalFallbackResponse(lastUserMessage.text);
    return res.json({ text: reply });
  }

  try {
    // Collect last 6 messages for simple fast conversational context
    const chatParts = messages.slice(-6).map((m: any) => ({
      role: m.role === "model" ? "model" as const : "user" as const,
      parts: [{ text: m.text }]
    }));

    // Multi-model resilience pattern: Try Gemini 3.5 Flash, then Gemini 3.1 Flash Lite
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let finalReply = "";
    let finalSuccess = false;
    let fallbackError: any = null;

    for (const modelName of modelsToTry) {
      if (finalSuccess) break;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`[Gemini API] Querying model ${modelName} (Attempt ${attempt}/2)...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: chatParts,
            config: {
              systemInstruction: HOSPITALITY_SYSTEM_PROMPT,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            finalReply = response.text;
            finalSuccess = true;
            break;
          }
          throw new Error("Empty model response text");
        } catch (err: any) {
          fallbackError = err;
          const statusMsg = err?.status || err?.message || JSON.stringify(err);
          console.warn(`[Gemini Warning] Model ${modelName} Attempt ${attempt} failed: ${statusMsg}`);
          
          if (attempt < 2) {
            // Wait briefly before retrying
            await new Promise(resolve => setTimeout(resolve, attempt * 150));
          }
        }
      }
    }

    if (finalSuccess) {
      return res.json({ text: finalReply });
    }

    console.error("All Gemini API models failed under high demand. Initiating local intelligent fallback.", fallbackError);
    const fallbackText = getLocalFallbackResponse(lastUserMessage.text);
    return res.json({ text: fallbackText });

  } catch (err: any) {
    console.error("Unhandleable exception in Gemini API handler, playing local fallback:", err);
    const fallbackText = getLocalFallbackResponse(lastUserMessage.text);
    return res.json({ text: fallbackText });
  }
});

// Configure Vite middleware / asset serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========== Rajeshwari Server Running ==========`);
    console.log(`Port: ${PORT}`);
    console.log(`Development URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
  });
}

startServer();

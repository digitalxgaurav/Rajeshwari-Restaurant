/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Beverages' | 'Starters' | 'Chinese' | 'Soups';
  description?: string;
  isPopular?: boolean;
}

export interface RoomType {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  image: string;
  amenities: string[];
  tag: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  role: string;
}

export interface GalleryItem {
  id: string;
  category: 'Hotel Exterior' | 'Rooms' | 'Restaurant' | 'Dining Area' | 'Food' | 'Guests';
  title: string;
  url: string;
}

export interface BookingFormInput {
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  specialRequest: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// Updated themes with more options and patterns
export const themes = [
  // Solid colors (existing themes)
  {
    id: "blue",
    name: "Professional Blue",
    type: "color",
    primary: "#1565c0",
    secondary: "#e3f2fd",
    category: "solid",
  },
  {
    id: "dark",
    name: "Elegant Dark",
    type: "color",
    primary: "#212121",
    secondary: "#f5f5f5",
    category: "solid",
  },
  {
    id: "green",
    name: "Nature Green",
    type: "color",
    primary: "#2e7d32",
    secondary: "#e8f5e9",
    category: "solid",
  },
  {
    id: "purple",
    name: "Creative Purple",
    type: "color",
    primary: "#6a1b9a",
    secondary: "#f3e5f5",
    category: "solid",
  },
  {
    id: "orange",
    name: "Energetic Orange",
    type: "color",
    primary: "#e65100",
    secondary: "#fff3e0",
    category: "solid",
  },

  // New solid colors
  {
    id: "red",
    name: "Bold Red",
    type: "color",
    primary: "#c62828",
    secondary: "#ffebee",
    category: "solid",
  },
  {
    id: "teal",
    name: "Calm Teal",
    type: "color",
    primary: "#00796b",
    secondary: "#e0f2f1",
    category: "solid",
  },
  {
    id: "pink",
    name: "Vibrant Pink",
    type: "color",
    primary: "#ad1457",
    secondary: "#fce4ec",
    category: "solid",
  },
  {
    id: "indigo",
    name: "Deep Indigo",
    type: "color",
    primary: "#283593",
    secondary: "#e8eaf6",
    category: "solid",
  },
  {
    id: "amber",
    name: "Warm Amber",
    type: "color",
    primary: "#ff8f00",
    secondary: "#fff8e1",
    category: "solid",
  },

  // Gradients
  {
    id: "gradient-blue",
    name: "Blue Gradient",
    type: "gradient",
    gradient: "linear-gradient(135deg, #1e88e5 0%, #512da8 100%)",
    primary: "#1e88e5",
    secondary: "#e3f2fd",
    category: "gradient",
  },
  {
    id: "gradient-green",
    name: "Green Gradient",
    type: "gradient",
    gradient: "linear-gradient(135deg, #43a047 0%, #1de9b6 100%)",
    primary: "#43a047",
    secondary: "#e8f5e9",
    category: "gradient",
  },
  {
    id: "gradient-sunset",
    name: "Sunset",
    type: "gradient",
    gradient: "linear-gradient(135deg, #ff7043 0%, #ff1744 100%)",
    primary: "#ff7043",
    secondary: "#ffebee",
    category: "gradient",
  },
  {
    id: "gradient-purple",
    name: "Purple Dreams",
    type: "gradient",
    gradient: "linear-gradient(135deg, #6a1b9a 0%, #ea80fc 100%)",
    primary: "#6a1b9a",
    secondary: "#f3e5f5",
    category: "gradient",
  },
  {
    id: "gradient-ocean",
    name: "Ocean Depths",
    type: "gradient",
    gradient: "linear-gradient(135deg, #0277bd 0%, #00bcd4 100%)",
    primary: "#0277bd",
    secondary: "#e0f7fa",
    category: "gradient",
  },

  // Patterns
  {
    id: "pattern-dots",
    name: "Dotted",
    type: "pattern",
    pattern: `radial-gradient(#0001 1px, transparent 0) 0 0 / 20px 20px`,
    background: "#f5f5f5",
    primary: "#455a64",
    secondary: "#eceff1",
    category: "pattern",
  },
  {
    id: "pattern-stripes",
    name: "Diagonal Stripes",
    type: "pattern",
    pattern: `repeating-linear-gradient(45deg, #0001, #0001 5px, transparent 5px, transparent 10px)`,
    background: "#f5f5f5",
    primary: "#37474f",
    secondary: "#eceff1",
    category: "pattern",
  },
  {
    id: "pattern-grid",
    name: "Grid",
    type: "pattern",
    pattern: `linear-gradient(#0001 1px, transparent 0) 0 0 / 20px 20px, 
              linear-gradient(90deg, #0001 1px, transparent 0) 0 0 / 20px 20px`,
    background: "#f5f5f5",
    primary: "#424242",
    secondary: "#f5f5f5",
    category: "pattern",
  },
  {
    id: "pattern-zigzag",
    name: "Zigzag",
    type: "pattern",
    pattern: `linear-gradient(135deg, #0001 25%, transparent 25%) -10px 0,
              linear-gradient(225deg, #0001 25%, transparent 25%) -10px 0,
              linear-gradient(315deg, #0001 25%, transparent 25%),
              linear-gradient(45deg, #0001 25%, transparent 25%)`,
    background: "#f5f5f5",
    backgroundSize: "20px 20px",
    primary: "#5d4037",
    secondary: "#efebe9",
    category: "pattern",
  },
  {
    id: "pattern-triangles",
    name: "Triangles",
    type: "pattern",
    pattern: `linear-gradient(60deg, #0001 25%, transparent 25.5%) 0 0 / 20px 20px,
              linear-gradient(120deg, #0001 25%, transparent 25.5%) 0 0 / 20px 20px,
              linear-gradient(180deg, #0001 25%, transparent 25.5%) 0 0 / 20px 20px,
              linear-gradient(240deg, #0001 25%, transparent 25.5%) 0 0 / 20px 20px,
              linear-gradient(300deg, #0001 25%, transparent 25.5%) 0 0 / 20px 20px`,
    background: "#f5f5f5",
    primary: "#4e342e",
    secondary: "#efebe9",
    category: "pattern",
  },
];

// Load or generate a viewer ID
export const getViewerId = () => {
  let viewerId = localStorage.getItem("viewerId");
  if (!viewerId) {
    viewerId =
      "v_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem("viewerId", viewerId);
  }
  return viewerId;
};

// backgroundOptions.js - Create this file to store all background options

// Solid color themes
export const colorThemes = [
  {
    id: "blue",
    name: "Professional Blue",
    primary: "#1565c0",
    secondary: "#e3f2fd",
  },
  {
    id: "dark",
    name: "Elegant Dark",
    primary: "#212121",
    secondary: "#f5f5f5",
  },
  {
    id: "green",
    name: "Nature Green",
    primary: "#2e7d32",
    secondary: "#e8f5e9",
  },
  {
    id: "purple",
    name: "Creative Purple",
    primary: "#6a1b9a",
    secondary: "#f3e5f5",
  },
  {
    id: "orange",
    name: "Energetic Orange",
    primary: "#e65100",
    secondary: "#fff3e0",
  },
  // New color themes
  {
    id: "teal",
    name: "Tranquil Teal",
    primary: "#00796b",
    secondary: "#e0f2f1",
  },
  {
    id: "red",
    name: "Bold Red",
    primary: "#c62828",
    secondary: "#ffebee",
  },
  {
    id: "indigo",
    name: "Deep Indigo",
    primary: "#283593",
    secondary: "#e8eaf6",
  },
  {
    id: "brown",
    name: "Warm Brown",
    primary: "#5d4037",
    secondary: "#efebe9",
  },
  {
    id: "pink",
    name: "Soft Pink",
    primary: "#ad1457",
    secondary: "#fce4ec",
  },
];

// Gradient backgrounds
export const gradientBackgrounds = [
  {
    id: "gradient1",
    name: "Blue Gradient",
    value: "linear-gradient(135deg, #1e88e5 0%, #64b5f6 100%)",
    thumbnail:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&auto=format&fit=crop",
  },
  {
    id: "gradient2",
    name: "Purple Gradient",
    value: "linear-gradient(135deg, #8e24aa 0%, #b39ddb 100%)",
    thumbnail:
      "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=600&auto=format&fit=crop",
  },
  {
    id: "gradient3",
    name: "Sunset Gradient",
    value: "linear-gradient(135deg, #ff7043 0%, #ffcc80 100%)",
    thumbnail:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop",
  },
  {
    id: "gradient4",
    name: "Green Gradient",
    value: "linear-gradient(135deg, #43a047 0%, #81c784 100%)",
    thumbnail:
      "https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=600&auto=format&fit=crop",
  },
  {
    id: "gradient5",
    name: "Dark Gradient",
    value: "linear-gradient(135deg, #424242 0%, #757575 100%)",
    thumbnail:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop",
  },
];

// Pattern backgrounds
export const patternBackgrounds = [
  {
    id: "pattern1",
    name: "Geometric Pattern",
    value: "url('https://www.transparenttextures.com/patterns/gplay.png')",
    thumbnail:
      "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=600&auto=format&fit=crop",
  },
  {
    id: "pattern2",
    name: "Subtle Dots",
    value: "url('https://www.transparenttextures.com/patterns/dots.png')",
    thumbnail:
      "https://images.unsplash.com/photo-1554147090-e1221a04a025?w=600&auto=format&fit=crop",
  },
  {
    id: "pattern3",
    name: "Diamond Upholstery",
    value:
      "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')",
    thumbnail:
      "https://images.unsplash.com/photo-1554110397-2dc9f322b389?w=600&auto=format&fit=crop",
  },
  {
    id: "pattern4",
    name: "Subtle Waves",
    value:
      "url('https://www.transparenttextures.com/patterns/asfalt-light.png')",
    thumbnail:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&auto=format&fit=crop",
  },
  {
    id: "pattern5",
    name: "Crosshatch",
    value: "url('https://www.transparenttextures.com/patterns/crosshatch.png')",
    thumbnail:
      "https://images.unsplash.com/photo-1513346940221-6f673d962e97?w=600&auto=format&fit=crop",
  },
];

// Image backgrounds
export const imageBackgrounds = [
  {
    id: "image1",
    name: "Abstract Fluid",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop",
  },
  {
    id: "image2",
    name: "Modern Minimal",
    url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&auto=format&fit=crop",
  },
  {
    id: "image3",
    name: "Business Theme",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
  },
  {
    id: "image4",
    name: "Light Texture",
    url: "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=600&auto=format&fit=crop",
  },
  {
    id: "image5",
    name: "Nature Inspired",
    url: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop",
  },
];

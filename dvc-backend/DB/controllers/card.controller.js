// Backend Controller for Digital Cards
const Card = require("../models/card.model");
const mongoose = require("mongoose"); // Create this model

// Get all cards for a user
exports.getUserCards = async (req, res) => {
  try {
    const userId = req.user._id;
    const cards = await Card.find({ userId });
    res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new card
exports.createCard = async (req, res) => {
  try {
    const cardData = req?.body;

    // Assign user ID from authenticated user
    cardData.userId = req.user._id;

    // Create new card
    const newCard = new Card(cardData);

    // Save to database
    const savedCard = await newCard.save();

    res.status(201).json(savedCard);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get a single card by ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a card
exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check if user owns the card
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to edit this card" });
    }

    // Update card data
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req?.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a card
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check if user owns the card
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this card" });
    }

    await Card.findByIdAndDelete(req.params.id);

    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: error.message });
  }
};

// PRODUCT METHODS

// Get all products for a card
exports.getCardProducts = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Return the products array or empty array if no products
    res.json(card.products || []);
  } catch (error) {
    console.error("Error fetching card products:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a product to a card
// controllers/card.controller.js
exports.addCardProduct = async (req, res) => {
  try {
    const { cardId } = req.params;

    // Check if the card exists and belongs to the user
    const card = await Card.findOne({
      _id: cardId,
      userId: req.user.id,
    });

    if (!card) {
      return res
        .status(404)
        .json({ error: "Card not found or not authorized" });
    }

    // Debug - log the incoming data
    console.log("Request body:", req?.body);
    console.log("Request files:", req.files);

    // Process the uploaded files
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      // If using multer's array method
      req?.files?.forEach((file) => {
        const host = req.get("host");
        const protocol = req.protocol; // 'http' or 'https'

        // Create the full URL path to the image
        // This will be something like: http://localhost:5000/uploads/products/filename.jpg
        const imageUrl = `${protocol}://${host}/uploads/products/${file.filename}`;

        imageUrls.push(imageUrl);
      });
    }

    // Parse existing images if any
    let existingImages = [];
    if (req?.body?.productImages) {
      try {
        existingImages = JSON.parse(req?.body?.productImages);
      } catch (e) {
        console.error("Error parsing existingImages:", e);
      }
    }

    // Combine existing and new image URLs
    imageUrls = [...existingImages, ...imageUrls];

    // Create the new product object with all required fields
    const newProduct = {
      name: req?.body.name, // Make sure this is present and not empty
      images: imageUrls,
      price: req?.body?.price || "",
      description: req?.body?.description || "",
      category: req?.body?.category || "",
      featured: req?.body?.featured === "true" || req?.body?.featured === true,
      ctaType: req?.body?.ctaType || "inquiry",
      ctaLink: req?.body?.ctaLink || "",
    };

    // Validate required fields before saving
    if (!newProduct.name || newProduct.name.trim() === "") {
      return res.status(400).json({ error: "Product name is required" });
    }

    // Add the product to the card
    card.products.push(newProduct);
    await card.save();

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ error: error.message || "Server error while adding product" });
  }
};

// Update a product
exports.updateCardProduct = async (req, res) => {
  try {
    const { cardId, productId } = req.params;
    const productData = req?.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check if user owns the card
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to edit this card" });
    }

    // Find the product in the array
    const productIndex = card.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product
    card.products[productIndex] = {
      ...card.products[productIndex].toObject(), // Convert to plain object
      ...productData,
      _id: card.products[productIndex]._id, // Keep the same ID
    };

    await card.save();

    res.json(card.products[productIndex]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
exports.deleteCardProduct = async (req, res) => {
  try {
    const { cardId, productId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check if user owns the card
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to edit this card" });
    }

    // Remove the product from the array
    card.products = card.products.filter(
      (product) => product._id.toString() !== productId
    );

    await card.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
};

// BUSINESS HOURS METHODS

// Get business hours for a card
exports.getBusinessHours = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Return business hours or default structure if not set
    res.json(
      card.businessHours || {
        monday: { open: "09:00", close: "17:00", isOpen: true },
        tuesday: { open: "09:00", close: "17:00", isOpen: true },
        wednesday: { open: "09:00", close: "17:00", isOpen: true },
        thursday: { open: "09:00", close: "17:00", isOpen: true },
        friday: { open: "09:00", close: "17:00", isOpen: true },
        saturday: { open: "10:00", close: "14:00", isOpen: false },
        sunday: { open: "00:00", close: "00:00", isOpen: false },
      }
    );
  } catch (error) {
    console.error("Error fetching business hours:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update business hours
exports.updateBusinessHours = async (req, res) => {
  try {
    const { cardId } = req.params;
    const hoursData = req?.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check if user owns the card
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to edit this card" });
    }

    // Update business hours
    card.businessHours = hoursData;
    await card.save();

    res.json(card.businessHours);
  } catch (error) {
    console.error("Error updating business hours:", error);
    res.status(400).json({ error: error.message });
  }
};

// TESTIMONIAL METHODS

// Get testimonials for a card
exports.getTestimonials = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Return the testimonials array or empty array if no testimonials
    res.json(card.testimonials || []);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a testimonial
exports.addTestimonial = async (req, res) => {
  try {
    const { cardId } = req.params;
    const testimonialData = req?.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Create a new testimonial with an ID
    const newTestimonial = {
      ...testimonialData,
      _id: new mongoose.Types.ObjectId(), // Generate a new ID
      date: new Date(),
      approved: false, // New testimonials require approval
    };

    // Add to testimonials array (initialize if it doesn't exist)
    if (!card.testimonials) {
      card.testimonials = [];
    }

    card.testimonials.push(newTestimonial);
    await card.save();

    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(400).json({ error: error.message });
  }
};

// Approve a testimonial
exports.approveTestimonial = async (req, res) => {
  try {
    const { cardId, testimonialId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check if user owns the card
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to approve testimonials" });
    }

    const testimonialIndex = card.testimonials.findIndex(
      (testimonial) => testimonial._id.toString() === testimonialId
    );
    // Find the testimonial in the array
    if (testimonialIndex === -1) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // Approve the testimonial
    card.testimonials[testimonialIndex].approved = true;
    await card.save();

    res.json(card.testimonials[testimonialIndex]);
  } catch (error) {
    console.error("Error approving testimonial:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { cardId, testimonialId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check if user owns the card
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete testimonials" });
    }

    // Remove the testimonial from the array
    card.testimonials = card.testimonials.filter(
      (testimonial) => testimonial._id.toString() !== testimonialId
    );

    await card.save();

    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: error.message });
  }
};

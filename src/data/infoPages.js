export const infoPages = {
  faq: {
    subtitle: 'Frequently Asked Questions',
    title: 'Everything You Need to Know',
    seoTitle: 'FAQ | Caviar Beauty',
    seoDesc: 'Answers to common questions about ordering, payments, delivery, and products at Caviar Beauty.',
    intro: 'Find quick answers about ordering, payments, delivery, and our products. Can\'t find what you\'re looking for? Contact us and we\'ll reply within 24 hours.',
    sections: [
      {
        heading: 'Ordering & Payment',
        body: [
          'Placing an order takes less than two minutes. Add items to your bag, enter a delivery address, choose a payment method, and confirm.',
        ],
        items: [
          'What payment methods do you accept? — We accept all major credit and debit cards, UPI, net banking, and digital wallets via our secure Razorpay gateway.',
          'Is checkout secure? — Yes. All payments are processed over an encrypted connection through Razorpay, a PCI-DSS compliant payment provider. We never store your card details.',
          'Do you provide an invoice? — Yes. A GST-compliant invoice is available for every order. You can download it from the order detail page.',
          'Can I cancel my order? — Orders can be cancelled while they are still pending or confirmed. Once an order is shipped, it cannot be cancelled.',
        ],
      },
      {
        heading: 'Delivery',
        body: [
          'We deliver across India through our trusted courier partners.',
        ],
        items: [
          'How long does delivery take? — Most orders are dispatched within 24-48 hours and delivered in 3-7 business days depending on your location.',
          'How much does shipping cost? — Shipping is ₹99 for all orders. It\'s free on orders above ₹5,000.',
          'How do I track my order? — Once your order is shipped, a tracking number appears on your order detail page. You can also check the status under My Orders in your account.',
        ],
      },
      {
        heading: 'Products & Authenticity',
        body: [
          'Every Caviar Beauty piece is crafted with uncompromising attention to detail.',
        ],
        items: [
          'Are your products genuine? — Every piece is manufactured by us and authenticated at the atelier before dispatch.',
          'What is the warranty? — Each piece includes a craftsmanship warranty against manufacturing defects.',
          'Do you offer gift wrapping? — Yes, every order arrives in our signature luxury packaging at no extra cost.',
        ],
      },
    ],
  },
  sizeGuide: {
    subtitle: 'Size Guide',
    title: 'Find Your Perfect Fit',
    seoTitle: 'Size Guide | Caviar Beauty',
    seoDesc: 'Handbag dimensions and footwear size conversion charts for Caviar Beauty products.',
    intro: 'Use the charts below to choose the right size. When in doubt, we recommend sizing up for footwear and reviewing bag dimensions against an item you already own.',
    sections: [
      {
        heading: 'Handbags',
        body: [
          'All dimensions are in centimetres (length x height x depth).',
        ],
        items: [
          'Small — 24 x 18 x 8 cm — Essentials only (phone, cardholder, lipstick)',
          'Medium — 30 x 22 x 10 cm — Daily carry (wallet, sunglasses, keys)',
          'Large — 38 x 28 x 14 cm — Work & travel (laptop up to 14", documents)',
        ],
      },
      {
        heading: 'Footwear',
        body: [
          'Our footwear fits true to size. Use this conversion chart to find your EU size, then check each product page for fit notes.',
        ],
        table: [
          { eu: 'EU 36', uk: 'UK 3', us: 'US 6', inr: 'IN 5' },
          { eu: 'EU 37', uk: 'UK 4', us: 'US 7', inr: 'IN 6' },
          { eu: 'EU 38', uk: 'UK 5', us: 'US 8', inr: 'IN 7' },
          { eu: 'EU 39', uk: 'UK 6', us: 'US 9', inr: 'IN 8' },
          { eu: 'EU 40', uk: 'UK 7', us: 'US 10', inr: 'IN 9' },
          { eu: 'EU 41', uk: 'UK 8', us: 'US 11', inr: 'IN 10' },
          { eu: 'EU 42', uk: 'UK 9', us: 'US 12', inr: 'IN 11' },
        ],
      },
      {
        heading: 'Measuring Tips',
        items: [
          'Measure your foot in the evening when it\'s at its largest.',
          'Stand while measuring, with your heel against a wall.',
          'For half sizes or wide feet, order one size up.',
          'For bags, check the dimensions against an item you carry daily.',
        ],
      },
    ],
  },
  careInstructions: {
    subtitle: 'Care Instructions',
    title: 'Caring for Your Caviar Beauty Piece',
    seoTitle: 'Care Instructions | Caviar Beauty',
    seoDesc: 'How to care for your luxury leather handbags and footwear to keep them beautiful for years.',
    intro: 'A little care goes a long way. Follow these guidelines to keep your pieces looking as beautiful as the day they arrived.',
    sections: [
      {
        heading: 'Leather Care',
        items: [
          'Store in the dust bag provided, away from direct sunlight and heat.',
          'Use a soft, dry cloth to wipe away dust after each use.',
          'Apply a leather conditioner every 2-3 months to keep the leather supple.',
          'Keep leather away from water and liquids. If wet, blot gently and air dry naturally — never use a dryer.',
        ],
      },
      {
        heading: 'Hardware & Details',
        items: [
          'Clean metal hardware with a dry microfiber cloth to maintain its shine.',
          'Avoid contact with perfume, cosmetics, and harsh chemicals, which can discolour materials.',
          'Do not overstuff bags — this can distort their shape over time.',
        ],
      },
      {
        heading: 'Footwear',
        items: [
          'Rotate between pairs to let each pair rest between wears.',
          'Use a shoe tree or tissue paper to preserve shape when storing.',
          'Clean suede and leather with the appropriate brush or cloth only.',
          'Protect soles with a cobbler\'s treatment before first wear, especially for smooth-leather soles.',
        ],
      },
      {
        heading: 'General',
        items: [
          'Keep the original packaging and receipt with your order number for any warranty claims.',
          'For stubborn stains, please contact our concierge before attempting any treatment.',
        ],
      },
    ],
  },
  trackOrder: {
    subtitle: 'Order Tracking',
    title: 'Track Your Order',
    seoTitle: 'Track Order | Caviar Beauty',
    seoDesc: 'Learn how to track your Caviar Beauty order and understand each order status.',
    intro: 'Once your order ships, a tracking number and carrier link are added to your order detail page. Here\'s how to follow your order from placement to your doorstep.',
    sections: [
      {
        heading: 'How to Track',
        items: [
          'Sign in and go to My Orders in your account dashboard.',
          'Open your order and view the live status and tracking number.',
          'Click the carrier link to see real-time delivery updates.',
          'Watch your email — we send a notification at every step, from confirmation to delivery.',
        ],
      },
      {
        heading: 'Understanding Order Statuses',
        items: [
          'Pending — We\'ve received your order and are confirming payment.',
          'Confirmed — Payment is verified and your order is being prepared.',
          'Shipped — Your order is on its way. The tracking number is now available.',
          'Delivered — Your order has been delivered. Enjoy!',
          'Cancelled — The order was cancelled before dispatch. Any amount paid is refunded to your original payment method.',
        ],
      },
      {
        heading: 'Need Help?',
        body: [
          'If you can\'t find your tracking number or your order hasn\'t updated for a while, our concierge is here to help.',
        ],
        items: [
          'Email: hello@caviarbeauty.com',
          'We reply within 24 hours.',
        ],
      },
    ],
  },
};

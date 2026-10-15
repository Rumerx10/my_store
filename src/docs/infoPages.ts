import { SITE } from './site';

// Copy for the static information pages, rendered by app/(info)/[slug].
// The policy pages are plain-language drafts and need a legal review before launch.
export interface InfoPage {
  title: string;
  intro: string;
  updated?: string;
  sections: { heading: string; body: string[] }[];
}

export const INFO_PAGES: Record<string, InfoPage> = {
  about: {
    title: `About ${SITE.name}`,
    intro: SITE.tagline,
    sections: [
      {
        heading: 'What we do',
        body: [
          `${SITE.name} sells GoodWe solar panels, inverters, batteries and EV chargers for homes and businesses. We size the system for your electricity bill, deliver it, and our certified team installs it.`,
        ],
      },
      {
        heading: 'How we deliver',
        body: [
          'We deliver across Bangladesh. You can pay with cash on delivery, bKash, Nagad, Rocket or a card.',
          `Our support team is available ${SITE.hours}.`,
        ],
      },
      {
        heading: 'Where to find us',
        body: [SITE.address],
      },
    ],
  },
  shipping: {
    title: 'Shipping',
    intro: 'How and when your order reaches you.',
    sections: [
      {
        heading: 'Delivery times',
        body: [
          'Orders inside Dhaka usually arrive in 1 to 2 working days. Orders to the rest of Bangladesh usually take 3 to 5 working days.',
          'Batteries, commercial inverters and storage cabinets are heavy and travel by a separate carrier, which can take a few days longer. We call you to agree a delivery and installation slot.',
        ],
      },
      {
        heading: 'Delivery charges',
        body: [
          'The delivery charge depends on the option you choose at checkout. You see the full cost, including VAT, before you place the order.',
        ],
      },
      {
        heading: 'Tracking your order',
        body: [
          'Open My orders to see where each order is. The status changes when we pack it, hand it to the courier and deliver it.',
        ],
      },
    ],
  },
  returns: {
    title: 'Returns',
    intro: 'What to do if something is wrong with your order.',
    sections: [
      {
        heading: 'When you can return an item',
        body: [
          'Each product page lists its return window. Within that window you can return the item if it is unused and in its original packaging.',
          'Equipment that has already been installed or powered on can only be returned under the GoodWe manufacturer warranty, not as a change-of-mind return.',
        ],
      },
      {
        heading: 'How to return it',
        body: [
          `Contact us at ${SITE.email} or ${SITE.phone} with your order number. We arrange a pickup and tell you when to expect the courier.`,
        ],
      },
      {
        heading: 'Refunds',
        body: [
          'Once we receive and check the item, we refund the original payment method within 7 days. Cash on delivery orders are refunded to a bKash, Nagad or bank account you choose.',
        ],
      },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    intro: 'Short answers to the questions we hear most.',
    sections: [
      {
        heading: 'Which payment methods do you accept?',
        body: ['Cash on delivery, bKash, Nagad, Rocket and cards.'],
      },
      {
        heading: 'Can I change or cancel an order?',
        body: [
          'You can cancel an order from My orders until it is handed to the courier. To change an address or item, cancel the order and place a new one, or contact us.',
        ],
      },
      {
        heading: 'How do I use a coupon?',
        body: [
          'Enter the code in your cart before checkout. The discount shows in the order total.',
        ],
      },
      {
        heading: 'How long does delivery take?',
        body: ['1 to 2 working days inside Dhaka and 3 to 5 working days elsewhere in Bangladesh.'],
      },
      {
        heading: 'How do I reach support?',
        body: [`Email ${SITE.email} or call ${SITE.phone}, ${SITE.hours}.`],
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    intro: 'What we collect, why we collect it and the choices you have.',
    updated: '13 October 2026',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'We collect the details you give us when you order: your name, phone number, email and delivery address. We also keep a record of your orders, reviews and messages to our support team.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'We use your details to deliver orders, take payment, answer your questions and tell you about the status of an order. We send marketing emails only if you have agreed to receive them.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'We share the details needed to complete your order with our couriers and payment providers. We do not sell your personal information.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          `You can ask us for a copy of your information, or ask us to correct or delete it, by emailing ${SITE.email}.`,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of service',
    intro: `The rules that apply when you shop with ${SITE.name}.`,
    updated: '13 October 2026',
    sections: [
      {
        heading: 'Orders and prices',
        body: [
          'Prices are shown in Bangladeshi taka and include the discounts shown on the product page. VAT and delivery are added at checkout.',
          'An order is confirmed when we send you a confirmation. We may cancel an order if an item is out of stock or the price was shown in error; if you already paid, we refund you in full.',
        ],
      },
      {
        heading: 'Your account',
        body: [
          'You are responsible for keeping your account details secure and for the orders placed from your account.',
        ],
      },
      {
        heading: 'Returns and refunds',
        body: ['Returns and refunds follow our returns policy.'],
      },
      {
        heading: 'Contact',
        body: [`Questions about these terms can be sent to ${SITE.email}.`],
      },
    ],
  },
  cookies: {
    title: 'Cookie policy',
    intro: 'How this site uses cookies and similar storage.',
    updated: '13 October 2026',
    sections: [
      {
        heading: 'What we use',
        body: [
          'We use only the storage the site needs to work, for example to keep items in your cart while you browse.',
        ],
      },
      {
        heading: 'Managing cookies',
        body: [
          'You can clear or block cookies in your browser settings. Some parts of the site, such as the cart, may not work if you do.',
        ],
      },
    ],
  },
};

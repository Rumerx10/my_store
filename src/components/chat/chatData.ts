export interface ChatContact {
  id: number;
  name: string;
  role: string;
  initials: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

export interface Message {
  id: number;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
}

export const CHATS: ChatContact[] = [
  {
    id: 1,
    name: 'NextPower Support',
    role: 'Customer support',
    initials: 'NS',
    lastMessage: 'Your refund has been processed.',
    timestamp: '2:30 PM',
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: 2,
    name: 'Delivery: NM-2610-1182',
    role: 'Courier, Mirpur hub',
    initials: 'DL',
    lastMessage: 'I will reach your area by 5 PM.',
    timestamp: '1:15 PM',
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: 3,
    name: 'Solar design team',
    role: 'System sizing',
    initials: 'SD',
    lastMessage: 'A 5 kW system with 10 kWh storage fits your bill.',
    timestamp: '11:45 AM',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: 4,
    name: 'Installation crew',
    role: 'Site survey',
    initials: 'IC',
    lastMessage: 'The roof survey takes about an hour.',
    timestamp: 'Yesterday',
    isOnline: false,
    unreadCount: 1,
  },
];

export const INITIAL_MESSAGES: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      sender: 'user',
      text: 'Hi, I cancelled order NM-2608-0921. When will I get my money back?',
      timestamp: '2:21 PM',
    },
    {
      id: 2,
      sender: 'contact',
      text: 'Hi Tanvir, let me check that for you.',
      timestamp: '2:24 PM',
    },
    {
      id: 3,
      sender: 'contact',
      text: 'Your refund has been processed. It will reach your Nagad account within 3 days.',
      timestamp: '2:30 PM',
    },
  ],
  2: [
    {
      id: 1,
      sender: 'contact',
      text: 'Assalamu alaikum, I have your NextPower order.',
      timestamp: '1:10 PM',
    },
    {
      id: 2,
      sender: 'contact',
      text: 'I will reach your area by 5 PM. Please keep the cash ready.',
      timestamp: '1:15 PM',
    },
  ],
  3: [
    {
      id: 1,
      sender: 'user',
      text: 'Our monthly bill is about 9,000 taka. What size system do we need?',
      timestamp: '11:30 AM',
    },
    {
      id: 2,
      sender: 'contact',
      text: 'A 5 kW system with 10 kWh storage fits your bill. We suggest the GoodWe ES G2 with two Lynx U batteries.',
      timestamp: '11:45 AM',
    },
  ],
  4: [
    { id: 1, sender: 'user', text: 'How long does the roof survey take?', timestamp: 'Yesterday' },
    {
      id: 2,
      sender: 'contact',
      text: 'The roof survey takes about an hour. We check shade, roof strength and the wiring route.',
      timestamp: 'Yesterday',
    },
  ],
};

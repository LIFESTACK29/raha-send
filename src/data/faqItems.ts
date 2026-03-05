export interface FAQItemType {
    id: string;
    question: string;
    answer: string;
}

export const FAQ_ITEMS: FAQItemType[] = [
    {
        id: "1",
        question: "How do I track my package?",
        answer: "You can track your package in real-time from the Orders tab. Tap on any active order to see the live tracking map, estimated delivery time, and rider details.",
    },
    {
        id: "2",
        question: "What are the delivery charges?",
        answer: "Delivery charges are calculated based on the distance between pickup and drop-off locations. You'll see the exact fee before confirming your order. Prices start from ₦500 for short distances.",
    },
    {
        id: "3",
        question: "Can I cancel an order?",
        answer: "Yes, you can cancel an order before a rider picks up your package. Go to Orders, tap the active order, and select Cancel. A full refund will be processed within 24 hours.",
    },
    {
        id: "4",
        question: "What items are not allowed?",
        answer: "Hazardous materials, illegal substances, perishable goods without proper packaging, and items exceeding 25kg are not allowed. Contact support if you're unsure about a specific item.",
    },
    {
        id: "5",
        question: "How do I become a courier partner?",
        answer: "To become a courier partner, go to Profile > Become a Partner. You'll need a valid ID, a smartphone, and a means of transportation. Our team will review your application within 48 hours.",
    },
    {
        id: "6",
        question: "What payment methods are accepted?",
        answer: "We accept bank transfers, debit/credit cards, and wallet balance. You can add or manage your payment methods from Profile > Payment Methods.",
    },
];

export const RIDER_FAQ_ITEMS: FAQItemType[] = [
    {
        id: "1",
        question: "How do I get paid?",
        answer: "Earnings are compiled weekly and transferred directly to your registered bank account every Tuesday. You can view your current balance and payment history in the Earnings tab.",
    },
    {
        id: "2",
        question: "What if a customer is not at the drop-off location?",
        answer: "Please try contacting the customer via the app. If there is no response after 10 minutes, contact Support and they will advise you on how to return the package to the pickup hub safely.",
    },
    {
        id: "3",
        question: "Can I choose my working hours?",
        answer: "Yes, you have full flexibility! Simply toggle your availability to 'Online' when you are ready to accept delivery requests, and switch to 'Offline' when you are done for the day.",
    },
    {
        id: "4",
        question: "How do I update my vehicle documents?",
        answer: "Head over to your Profile -> Personal Information. If your documents are expired, an upload prompt will appear. After uploading, our team will review the new documents within 24 hours.",
    },
    {
        id: "5",
        question: "What should I do in an emergency?",
        answer: "Your safety is our priority. In the event of an accident or emergency, please use the SOS button on the delivery screen to alert our 24/7 security team and local authorities immediately.",
    },
];

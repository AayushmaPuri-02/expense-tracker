const sampleExpenses = [
  {
    title: "Grocery Shopping",
    amount: 120,
    category: "Food",
    date: new Date("2025-03-01"),
    note: "Weekly vegetable and fruits shopping",
    image: {
      url: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "food1"
    }
  },
  {
    title: "Electricity Bill",
    amount: 90,
    category: "Electricity",
    date: new Date("2025-03-05"),
    note: "Monthly power usage",
    image: {
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "electricity1"
    }
  },
  {
    title: "WiFi Internet",
    amount: 60,
    category: "Internet",
    date: new Date("2025-03-07"),
    note: "Monthly internet service",
    image: {
      url: "https://plus.unsplash.com/premium_photo-1683836722388-8643468c327d?q=80&w=3212&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "internet1"
    }
  },
  {
    title: "Movie Night",
    amount: 35,
    category: "Entertainment",
    date: new Date("2025-03-12"),
    note: "Watched new Marvel movie",
    image: {
      url: "https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "entertainment1"
    }
  },
  {
    title: "Taxi to Airport",
    amount: 45,
    category: "Transport",
    date: new Date("2025-03-15"),
    note: "Ola cab to airport",
    image: {
      url: "https://images.unsplash.com/photo-1578991132108-16c5296b63dc?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "transport1"
    }
  },
  {
    title: "Water Utility Bill",
    amount: 25,
    category: "Water",
    date: new Date("2025-03-18"),
    note: "Billed for water usage",
    image: {
      url: "https://source.unsplash.com/400x300/?water",
      filename: "water1"
    }
  },
  {
    title: "Netflix Subscription",
    amount: 20,
    category: "TV",
    date: new Date("2025-03-20"),
    note: "Monthly Netflix charge",
    image: {
      url: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "tv1"
    }
  },
  {
    title: "School Tuition",
    amount: 800,
    category: "School Fee",
    date: new Date("2025-03-25"),
    note: "Quarterly school fee payment",
    image: {
      url: "https://images.unsplash.com/photo-1516383607781-913a19294fd1?q=80&w=3274&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "school1"
    }
  },
  {
    title: "Miscellaneous Shopping",
    amount: 55,
    category: "Other",
    date: new Date("2025-03-28"),
    note: "Bought gifts and small items",
    image: {
      url: "https://source.unsplash.com/400x300/?shopping",
      filename: "other1"
    }
  },
  {
    title: "Coffee Alone",
    amount: 10,
    category: "Alone",
    date: new Date("2025-03-30"),
    note: "Relaxed at coffee shop",
    image: {
      url: "https://source.unsplash.com/400x300/?coffee",
      filename: "alone1"
    }
  }
];

module.exports = { data: sampleExpenses };
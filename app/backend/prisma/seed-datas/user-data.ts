export const users = [
  {
    name: 'Alice',
    email: 'Alice@xd.com',
    password: 'password123',
  },
  {
    name: 'Bob',
    email: 'Bob@xd.com',
    password: 'password123',
    Post: {
      create: [
        {
          title: 'Hello World',
          content: 'This is my first post.',
        },
        {
          title: 'Goodbye World',
          content: 'This is my last post.',
        },
      ],
    },
  },
  {
    name: 'Charlie',
    email: 'Charlie@xd.com',
    password: 'password123',
    Post: {
      create: [
        {
          title: '1',
          content: '1',
        },
        {
          title: '2',
          content: '2',
        },
        {
          title: '3',
          content: '3',
        },
        {
          title: '4',
          content: '4',
        },
        {
          title: '5',
          content: '5',
        },
      ],
    },
  },
];

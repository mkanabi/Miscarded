// uploadCategories.mjs
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./miscarded-firebase-adminsdk-ye5j6-9916459dd6.json', 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

const categories = [
  {
    category: 'animals',
    words: ['cat', 'dog', 'lion', 'tiger', 'elephant', 'giraffe', 'zebra', 'kangaroo', 'panda', 'bear']
  },
  {
    category: 'fruits',
    words: ['apple', 'banana', 'grape', 'orange', 'mango', 'pineapple', 'peach', 'cherry', 'kiwi', 'plum']
  },
  {
    category: 'colors',
    words: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white']
  },
  {
    category: 'countries',
    words: ['usa', 'canada', 'mexico', 'brazil', 'germany', 'france', 'italy', 'japan', 'china', 'india']
  },
  {
    category: 'vehicles',
    words: ['car', 'truck', 'motorcycle', 'bicycle', 'bus', 'train', 'airplane', 'boat', 'helicopter', 'submarine']
  },
  {
    category: 'sports',
    words: ['soccer', 'basketball', 'tennis', 'baseball', 'hockey', 'cricket', 'golf', 'rugby', 'volleyball', 'swimming']
  },
  {
    category: 'jobs',
    words: ['doctor', 'teacher', 'engineer', 'lawyer', 'nurse', 'pilot', 'chef', 'firefighter', 'police', 'artist']
  },
  {
    category: 'furniture',
    words: ['chair', 'table', 'sofa', 'bed', 'desk', 'cabinet', 'shelf', 'stool', 'dresser', 'wardrobe']
  },
  {
    category: 'tools',
    words: ['hammer', 'wrench', 'screwdriver', 'drill', 'saw', 'pliers', 'chisel', 'level', 'tape measure', 'ladder']
  },
  {
    category: 'instruments',
    words: ['guitar', 'piano', 'drums', 'violin', 'flute', 'trumpet', 'saxophone', 'clarinet', 'cello', 'harp']
  }
];

const uploadCategories = async () => {
  const categoriesCollection = firestore.collection('categories');

  for (const categoryData of categories) {
    await categoriesCollection.add(categoryData);
  }

  console.log('Categories uploaded successfully!');
};

uploadCategories().catch(console.error);

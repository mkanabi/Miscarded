// src/utils/fetchWords.js
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';

export const fetchWords = async (category) => {
  const categoriesCollection = collection(firestore, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCollection);
  const categoryDoc = categoriesSnapshot.docs.find(doc => doc.data().category === category);

  if (!categoryDoc) {
    throw new Error(`Category ${category} not found`);
  }

  return categoryDoc.data().words;
};

import React, { useEffect, useState } from 'react';
import { fireDB } from '../../firebase/firebaseConfig';
import { collection, doc, getDoc } from 'firebase/firestore';
import Layout from '../../components/layout/Layout';

function AboutUs() {
  const [fileUrls, setFileUrls] = useState([]);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const documentsCollection = collection(fireDB, 'documents');
        const docRef = doc(documentsCollection, 'About Us');
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data && data.urls && Array.isArray(data.urls)) {
            setFileUrls(data.urls);
          } else {
            console.log('No image URLs found in the "About Us" document.');
          }
        } else {
          console.log('No document found with the name "About Us".');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchAboutUs();
  }, []);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {fileUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Image ${index + 1}`}
            style={{ maxWidth: '75%', height: 'auto', margin: '0 auto' }}
          />
        ))}
      </div>
    </Layout>
  );
}

export default AboutUs;

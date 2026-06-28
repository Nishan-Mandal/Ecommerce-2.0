import React, { useEffect, useState } from 'react';
import { fireDB } from '../../firebase/firebaseConfig';
import { collection, doc, getDoc } from 'firebase/firestore';
import Layout from '../../components/layout/Layout';

function TermsConditions() {
  const [fileUrls, setFileUrls] = useState([]);

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const documentsCollection = collection(fireDB, 'documents');
        const docRef = doc(documentsCollection, 'Terms & Conditions');
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data && data.urls && Array.isArray(data.urls)) {
            setFileUrls(data.urls);
          } else {
            console.log('No image URLs found in the "Terms & Conditions" document.');
          }
        } else {
          console.log('No document found with the name "Terms & Conditions".');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchTermsConditions();
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

export default TermsConditions;

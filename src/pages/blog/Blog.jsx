import React, { useContext, useEffect, useState } from 'react'
import VideoPlayer from '../../components/videoPlayer/VideoPlayer'
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import { fireDB } from '../../firebase/firebaseConfig';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';

function Blog() {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const [blog, setBlog] = useState([]);

    const getBlogData = async () => {
        try {
            setLoading(true)
            const blogData = await getDocs(collection(fireDB, "blog"));
            const blogArray = [];
            blogData.forEach((doc) => {
                blogArray.push(doc.data());
            });
            setBlog(blogArray);
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getBlogData();
    }, [])

    // const videoIds = ['9kXpmP6vA4U', 'JNl1_hRwpXE', 'yX-mmvu9J7U', 'HBluMFFdoPk', 'GCPMx3L6zHE'];

    return (
        <Layout >
            <div className="flex flex-wrap -mx-4 p-6">
                {blog && blog.map((data, index) => (
                    <VideoPlayer key={index} videoId={data.YTVideoId} />
                ))}
            </div>
        </Layout>        
    )
}

export default Blog

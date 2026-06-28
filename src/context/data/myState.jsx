import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { fireDB } from '../../firebase/firebaseConfig';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';


function MyState(props) {
  const [mode, setMode] = useState('light');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = 'rgb(17, 24, 39)';
    }
    else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  }

  const [products, setProducts] = useState({
    id: '',
    title: '',
    price: '',
    imageUrl: '',
    category: '',
    description: '',
    time: Timestamp.now(),
    date: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )

  })

  // ********************** Add Product Section  **********************
  const addProduct = async () => {
    if (products.title == '' || products.price == '' || products.imageUrl == '' || products.category == '' || products.description == '') {
      return toast.error('Please fill all fields')
    }

    const productRef = doc(collection(fireDB, "products"));
    products.id = productRef.id;
    setLoading(true)
    try {
      await setDoc(productRef, products);
      toast.success("Product Add successfully")
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      getProductData()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setProducts("")
  }

  const [product, setProduct] = useState([]);

  // ****** get product
  const getProductData = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(fireDB, "products"),
        orderBy("time"),
        // limit(5)
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productsArray)
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getProductData();
  }, []);

  // update product function

  const edithandle = (item) => {
    setProducts(item)
  }

  const updateProduct = async () => {
    setLoading(true)
    try {
      await setDoc(doc(fireDB, 'products', products.id), products)
      toast.success("Product Updated successfully")
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800);
      getProductData();
      setLoading(false)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // delete product

  const deleteProduct = async (item) => {
    setLoading(true)
    try {
      await deleteDoc(doc(fireDB, 'products', item.id))
      toast.success('Product Deleted successfully')
      getProductData();
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  //Get Order Data

  const [order, setOrder] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'))?.user ?? 'null';
  
  const getOrderData = async () => {
    setLoading(true);
    try {
      if(userData==='null') return;
      let result;

      if (userData.email === 'kingshukdash123@gmail.com') {
        result = await getDocs(collection(fireDB, "orders"));
      } else {
        result = await getDocs(query(collection(fireDB, "orders"), where("userid", "==", userData.uid)));
      }
      
      const ordersArray = [];
      
      result.forEach((doc) => {
        ordersArray.push(doc.data());
      });
  
      setOrder(ordersArray);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  


  // Get user data, this function only runs in case of admin

  const [user, setUser] = useState([]);

  const getUserData = async () => {
    setLoading(true)
    try {
      const result = await getDocs(collection(fireDB, "users"))
      const usersArray = [];
      result.forEach((doc) => {
        usersArray.push(doc.data());
        setLoading(false)
      });
      setUser(usersArray);
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const [userName, setUsername] = useState('');
  const getUserName = async () => {
    setLoading(true)
    try {
      if(userData==='null') return;
      const result = await getDocs(query(collection(fireDB, "users"), where("uid", "==", userData.uid)));
      result.forEach((doc) => {
        setUsername(doc.data().name);
      });      
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  useEffect(() => {
    getProductData();
    getOrderData();
    getUserName();
  }, []);

  const [searchkey, setSearchkey] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPrice, setFilterPrice] = useState('')

  return (
    <MyContext.Provider value={{
      mode, toggleMode, loading, setLoading,
      product, products, setProducts, addProduct, edithandle, getOrderData, getUserData, updateProduct, deleteProduct, order, user, searchkey, setSearchkey, filterType, setFilterType,
      filterPrice, setFilterPrice, userName
    }}>
      {props.children}
    </MyContext.Provider>
  )
}

export default MyState
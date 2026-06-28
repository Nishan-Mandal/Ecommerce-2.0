import React, { useContext, useEffect } from 'react'
import myContext from '../../context/data/myContext'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart } from '../../redux/cartSlice'
import { Link } from 'react-router-dom'
import OrderNowModal from '../modal/OrderNowModal'

function ProductCard() {
    const context = useContext(myContext)
    const { mode, product, searchkey, setSearchkey, filterType, setFilterType,
        filterPrice, setFilterPrice } = context;

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    // add to cart
    const addCart = (product) => {
        const { time, ...serializableProduct } = product;
        dispatch(addToCart(serializableProduct));
        toast.success('add to cart');
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])


    useEffect(() => {
        setFilterType('');
        setFilterPrice('');
    }, [])


    return (
        <section className="text-gray-600 body-font">
            <div className="lg:container px-5 sm:py-8 sm:mb-8 md:py-16 mx-auto ">

            <div className="w-full mb-6 lg:mb-10">
                    <div className="flex">

                        <h1 className="lg:text-3xl md:text-2xl sm:text-l font-medium title-font mb-2 mr-6 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Latest Collection
                        </h1>
                        <OrderNowModal />
                        <Link to={'/allproducts'} className="sm:text-xs md:text-sm lg:text-base font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : 'blue', marginLeft: 'auto', alignSelf: 'flex-end', borderBottom: '1.5px solid blue' }}>See all</Link>

                    </div>

                    <div className="h-1 w-20 bg-neutral-950 rounded"></div>
                </div>
                <div className="flex flex-nowrap overflow-x-auto -m-4 mb-10">
                    {product.filter((obj) => obj.title.toLowerCase().includes(searchkey))
                        .filter((obj) => obj.category.includes(filterType))
                        .filter((obj) => obj.price.includes(filterPrice))
                        .filter((obj) => obj.category.includes('Custom')).map((item, index) => {
                            const { title, price, description, imageUrl } = item;
                            return (
                                <div onClick={(e) => window.location.href = `/productinfo/${item.id}`} key={index} className="p-3 lg:w-1/5 drop-shadow-lg ">
                                    <div className="flex-1 h-[420px] w-60 border-2 rounded-2xl overflow-hidden flex flex-col hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                        <div className="h-56 overflow-hidden cursor-pointer">
                                            <img className="rounded-2xl w-full h-full object-cover p-2 hover:scale-110 transition-transform duration-300 ease-in-out" src={imageUrl} alt="blog" />
                                        </div>

                                        <div className="flex flex-col justify-between flex-1 p-4 border-t-2">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-0" style={{ color: mode === 'dark' ? 'white' : '' }}>HN Enterprise</h2>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-0" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h1>
                                            <p className="leading-relaxed mb-1" style={{ color: mode === 'dark' ? 'white' : '' }}>₹ {price}</p>
                                            <div className=" justify-center">
                                                <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); addCart(item); }} type="button" className="focus:outline-none text-white bg-neutral-950 hover:bg-neutral-950 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2">Add To Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>


                <div className="w-full mb-6 lg:mb-10">
                    <div className="flex">
                        <h1 className="lg:text-3xl md:text-2xl sm:text-xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Our Latest Collection</h1>
                        <Link to={'/allproducts'} className="sm:text-xs md:text-sm lg:text-base font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : 'blue', marginLeft: 'auto', alignSelf: 'flex-end', borderBottom: '1.5px solid blue' }}>See all</Link>
                    </div>

                    <div className="h-1 w-20 bg-neutral-950 rounded"></div>
                </div>

                <div className="flex flex-nowrap overflow-x-auto -m-4 mb-10">
                    {product.filter((obj) => obj.title.toLowerCase().includes(searchkey))
                        .filter((obj) => obj.category.includes(filterType))
                        .filter((obj) => obj.price.includes(filterPrice))
                        .filter((obj) => obj.category.includes('ReadyMade')).map((item, index) => {
                            const { title, price, description, imageUrl } = item;
                            return (
                                <div onClick={(e) => window.location.href = `/productinfo/${item.id}`} key={index} className="p-3 lg:w-1/5 drop-shadow-lg ">
                                    <div className="flex-1 h-[420px] w-60 border-2 rounded-2xl overflow-hidden flex flex-col hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                        <div className="h-56 overflow-hidden cursor-pointer">
                                            <img className="rounded-2xl w-full h-full object-cover p-2 hover:scale-110 transition-transform duration-300 ease-in-out" src={imageUrl} alt="blog" />
                                        </div>

                                        <div className="flex flex-col justify-between flex-1 p-4 border-t-2">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-0" style={{ color: mode === 'dark' ? 'white' : '' }}>HN Enterprise</h2>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-0" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h1>
                                            <p className="leading-relaxed mb-1" style={{ color: mode === 'dark' ? 'white' : '' }}>₹ {price}</p>
                                            <div className=" justify-center">
                                                <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); addCart(item); }} type="button" className="focus:outline-none text-white bg-neutral-950 hover:bg-neutral-950 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2">Add To Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>

                <div className="w-full mb-6 lg:mb-10">
                    <div className="flex">
                        <h1 className="lg:text-3xl md:text-2xl sm:text-xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Premium Collection</h1>
                        <Link to={'/allproducts'} className="sm:text-xs md:text-sm lg:text-base font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : 'blue', marginLeft: 'auto', alignSelf: 'flex-end', borderBottom: '1.5px solid blue' }}>See all</Link>
                    </div>

                    <div className="h-1 w-20 bg-neutral-950 rounded"></div>
                </div>
                <div className="flex flex-nowrap overflow-x-auto -m-4 mb-10">
                    {product.filter((obj) => obj.title.toLowerCase().includes(searchkey))
                        .filter((obj) => obj.category.includes(filterType))
                        .filter((obj) => obj.price.includes(filterPrice))
                        .filter((obj) => obj.category.includes('ReadyMade-Premium')).map((item, index) => {
                            const { title, price, description, imageUrl } = item;
                            return (
                                <div onClick={(e) => window.location.href = `/productinfo/${item.id}`} key={index} className="p-3 lg:w-1/5 drop-shadow-lg ">
                                    <div className="flex-1 h-[420px] w-60 border-2 rounded-2xl overflow-hidden flex flex-col hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                        <div className="h-56 overflow-hidden cursor-pointer">
                                            <img className="rounded-2xl w-full h-full object-cover p-2 hover:scale-110 transition-transform duration-300 ease-in-out" src={imageUrl} alt="blog" />
                                        </div>

                                        <div className="flex flex-col justify-between flex-1 p-4 border-t-2">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-0" style={{ color: mode === 'dark' ? 'white' : '' }}>HN Enterprise</h2>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-0" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h1>
                                            <p className="leading-relaxed mb-1" style={{ color: mode === 'dark' ? 'white' : '' }}>₹ {price}</p>
                                            <div className=" justify-center">
                                                <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); addCart(item); }} type="button" className="focus:outline-none text-white bg-neutral-950 hover:bg-neutral-950 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2">Add To Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>

            </div>
        </section >

    )
}

export default ProductCard
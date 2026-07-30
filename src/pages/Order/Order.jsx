import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import useOrders from '../../hooks/order/useOrders'
import Layout from '../../components/layout/Layout'
import Loader from '../../components/loader/Loader'
import { Link } from 'react-router-dom'

function Order() {
  const { orders, loading } = useOrders();
  const { mode } = useTheme();

  return (
    <div>
      {loading && <Loader />}
      {orders.length > 0 ?
        (<>
          <div className="h-full pt-10 flex flex-col items-center sm:px-4">
            <h1 className="mb-10 text-center text-2xl font-bold" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>Your Orders</h1>
            {
              orders.map((order) => {
                if (order.isCustom === true) {
                  return (
                    <div key={`${order.date}`} className="justify-between mb-6 rounded-lg border  drop-shadow-xl bg-white   sm:flex  sm:justify-start md:w-2/3 mb-4  overflow-y-auto max-h-[85vh]">
                      <div className="justify-between rounded-lg bg-white p-6 sm:flex sm:justify-start w-full" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
                        <img src={order.image} alt="product-image" className="w-full rounded-lg sm:w-40" style={{ aspectRatio: '1/1', objectFit: 'contain' }} />
                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                          <div className="mt-5 sm:mt-2 w-full">
                            <h2 className="text-lg font-bold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{order.itemInfo.selectedDrawingType}</h2>
                            <h2 className="text-sm text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>
                              Drawing Sheet: {order.itemInfo.selectedSheetType}
                            </h2>
                            <p className="mt-2 text-sm font-bold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{order.totalAmount}</p>
                            <p className="mt-2 text-sm font-bold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Estimated delivery: {order.edDate.toDate().toLocaleString().split(',')[0]}</p>

                            <button
                              className={`flex items-center px-4 py-2 rounded ml-auto mt-2 ${mode === 'dark' ? 'bg-white' : 'bg-gray-200'
                                }`}
                              type="button"
                            >
                              <h2 className="font-semibold capitalize sm:text-xs md:text-sm" style={{ color: mode === 'dark' ? 'black' : '' }}>
                                {order.status}
                              </h2>
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  )
                  const itemsList = Array.isArray(order.products) ? order.products : (Array.isArray(order.items) ? order.items : []);
                  return (
                    itemsList.map((item, idx) => {
                      const img = item.productImage || item.imageUrl || item.images?.[0] || "https://via.placeholder.com/150";
                      const title = item.productName || item.title || item.name || "Product Item";
                      const price = item.sellingPrice || item.price || item.totalPrice || order.pricing?.grandTotal || order.totalAmount || 0;
                      const status = order.orderStatus || order.status || "PLACED";

                      return (
                        <div key={`${order.orderId || order.docId}-${item.productId || item.id || idx}`} onClick={(e) => { if (item.productId || item.id) window.location.href = `/productdetails/${item.productId || item.id}`; }} className="justify-between mb-6 rounded-lg border drop-shadow-xl bg-white sm:flex sm:justify-start md:w-2/3 mb-4 overflow-y-auto max-h-[85vh] cursor-pointer">
                          <div className="justify-between rounded-lg bg-white p-6 sm:flex sm:justify-start w-full" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
                            <img src={img} alt="product-image" className="w-full rounded-lg sm:w-40 object-cover" style={{ aspectRatio: '1/1' }} />
                            <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                              <div className="mt-5 sm:mt-2 w-full">
                                <h2 className="text-lg font-bold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h2>
                                {item.variantName && (
                                  <p className="text-xs text-gray-500 mt-1">Variant: {item.variantName}</p>
                                )}
                                <p className="mt-2 text-sm font-bold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{price}</p>
                                <button
                                  className={`flex items-center px-4 py-2 mt-2 rounded ml-auto ${mode === 'dark' ? 'bg-white' : 'bg-gray-200'}`}
                                  type="button"
                                >
                                  <h2 className="font-semibold capitalize sm:text-xs md:text-sm" style={{ color: mode === 'dark' ? 'black' : '' }}>
                                    {status}
                                  </h2>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  );
                }
              })
            }
          </div>
        </>)
        :
        (
          <div className="h-64 flex items-center justify-center" >
            <h2 className='text-center text-2xl mr-1' style={{ color: mode === 'dark' ? 'white' : '' }} >No Orders!</h2>
            <Link to={'/allproducts'} className="text-center text-2xl" style={{ color: mode === 'dark' ? 'blue' : 'blue' }}>
              Buy now
            </Link>
          </div>

        )

      }
    </div>
  )
}

export default Order
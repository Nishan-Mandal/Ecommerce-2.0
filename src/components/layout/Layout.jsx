import React from 'react'
import Footer from '../footer/Footer'
import Navbar from '../navbar/Navbar'
import OrderNowModal from '../modal/OrderNowModal'

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="content">
        {children}
      </div>
      <div className="fixed bottom-4 right-4 flex items-center">
        <OrderNowModal />
        <a href="https://wa.me/9564140786" className="inline-block sm:w-10 sm:h-10 md:w-14 md:h-14">
          <img src="https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Logo%2FWhatsApp%20Icon.png?alt=media&token=052a1421-479b-4e5a-9e76-de8be70f9354" alt="Link Icon" />
        </a>
      </div>
    </div>
  )
}

export default Layout
import React, { useContext } from 'react'
import myContext from '../../context/data/myContext'

function Testimonial() {
    const context = useContext(myContext)
    const { mode } = context
    return (
        <div>
            <section className="text-gray-600 body-font mb-10">
                <div className="container px-5 py-10 mx-auto">
                    <h1 className=' text-center text-3xl font-bold text-black' style={{ color: mode === 'dark' ? 'white' : '' }}>Testimonial</h1>
                    <h2 className=' text-center text-2xl font-semibold mb-10' style={{ color: mode === 'dark' ? 'white' : '' }}>What our <span className=' text-neutral-950'>customers</span> are saying</h2>
                    <div className="flex flex-wrap -m-4">
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Reviews%2Freview1.jpeg?alt=media&token=3d88aabe-c582-4058-92e2-ee2b86ffa8a6" />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="leading-relaxed">I ordered a custom handmade portrait drawing from this website, and I was blown away by the artistry and attention to detail. The portrait perfectly captured the essence of the subject, and the quality exceeded my expectations. I highly recommend these talented artists!</p>
                                <span className="inline-block h-1 w-10 rounded bg-neutral-950 mt-6 mb-4" />
                                <h2 style={{ color: mode === 'dark' ? '#ff4162' : '' }} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Nitin Kumar</h2>
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="text-gray-500">Art Enthusiast</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Reviews%2Freview%202.jpg?alt=media&token=36b984d2-a643-45b3-baf4-26e568132e6c" />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="leading-relaxed">I wanted to surprise my spouse with a special gift, and this website delivered beyond my imagination. The handmade portrait drawing conveyed the love and sentiment in every stroke. It's a heartfelt creation that brought tears of joy. Thank you for making the occasion truly memorable!</p>
                                <span className="inline-block h-1 w-10 rounded bg-neutral-950 mt-6 mb-4" />
                                <h2 style={{ color: mode === 'dark' ? '#ff4162' : '' }} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Riya Singh</h2>
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="text-gray-500">Freelancer</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://firebasestorage.googleapis.com/v0/b/e-commerce-d6aae.appspot.com/o/Reviews%2Freview%203.jpg?alt=media&token=f9cb6261-b9d1-4944-bf08-394f8161b598" />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="leading-relaxed">From start to finish, the experience with this website was exceptional. The customer service was prompt and friendly, and the final portrait exceeded all expectations. The attention to detail, color accuracy, and overall quality make this platform stand out. I'm a delighted customer and will be ordering again!</p>
                                <span className="inline-block h-1 w-10 rounded bg-neutral-950 mt-6 mb-4" />
                                <h2 style={{ color: mode === 'dark' ? '#ff4162' : '' }} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Payel Mandal</h2>
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="text-gray-500">Professor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Testimonial
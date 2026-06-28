import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import banner1 from "../../assets/banner1.png"
import banner2 from "../../assets/banner2.png"
import banner3 from "../../assets/banner3.png"
import banner4 from "../../assets/banner4.png"
import banner5 from "../../assets/banner5.png"




function HeroSection() {
  const images = [
    banner3, 
    banner5, 
    banner4

  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    // dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, 
    swipe:true,
    afterChange: (current) => setCurrentSlide(current),
  };



  return (
    <div className="relative overflow-hidden h-[300px] w-full">
      <Slider {...settings} className="">
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-[300px] object-contain"
            />
          </div>
        ))}
      </Slider>
      <div className="absolute lg:bottom-8 sm:bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2" style={{ marginLeft: `-${(images.length - 1) * 8}px` }}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-gray-300' : 'bg-gray-400'
              } opacity-70 hover:opacity-100 focus:outline-none`}
              style={{ position: 'relative', zIndex: 1 }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );

}

export default HeroSection
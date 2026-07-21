import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSiteConfig } from '../../../context/SiteConfigContext';

// Local fallback banners
import banner3 from "../../../assets/banner3.png";
import banner5 from "../../../assets/banner5.png";
import banner4 from "../../../assets/banner4.png";

const FALLBACK_BANNERS = [
    { bannerId: "f1", imageUrl: banner3, ctaUrl: null },
    { bannerId: "f2", imageUrl: banner5, ctaUrl: null },
    { bannerId: "f3", imageUrl: banner4, ctaUrl: null },
];

function HeroSection() {
    const { banners, loading } = useSiteConfig();
    const [currentSlide, setCurrentSlide] = useState(0);

    const displayBanners = loading || !banners || banners.length === 0 ? FALLBACK_BANNERS : banners;

    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        swipe: true,
        afterChange: (current) => setCurrentSlide(current),
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl border border-border-base/10 ">

            <Slider {...settings}>
                {displayBanners.map((banner, index) => (
                    <div key={banner.bannerId || index}>

                        <div className="relative h-[180px] sm:h-[260px] md:h-[340px] lg:h-[420px] xl:h-[500px]">

                            {/* Banner Image */}
                            <img
                                src={banner.imageUrl}
                                alt={banner.title || `Slide ${index + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Overlay */}
                           

                            {/* Content */}
                            {(banner.title || banner.subtitle || banner.ctaLabel) && (
                                <div className="absolute inset-0 flex items-center">

                                    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

                                        <div className="max-w-xs sm:max-w-md lg:max-w-2xl">

                                            {banner.title && (
                                                <h2 className="text-white font-black leading-tight text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg">
                                                    {banner.title}
                                                </h2>
                                            )}

                                            {banner.subtitle && (
                                                <p className="mt-3 text-white/90 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                                                    {banner.subtitle}
                                                </p>
                                            )}

                                            {banner.ctaLabel && banner.ctaUrl && (
                                                <Link
                                                    to={banner.ctaUrl}
                                                    className="inline-flex mt-5 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-primary text-compli font-bold text-sm sm:text-base hover:bg-primary-hover transition"
                                                >
                                                    {banner.ctaLabel}
                                                </Link>
                                            )}

                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                ))}
            </Slider>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/35 backdrop-blur-md px-3 py-2 rounded-full">

                {displayBanners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`transition-all duration-300 rounded-full ${i === currentSlide
                                ? "w-8 h-2 bg-white"
                                : "w-2 h-2 bg-white/40 hover:bg-white/70"
                            }`}
                    />
                ))}

            </div>

        </div>
    );
}

export default HeroSection;
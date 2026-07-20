import React from 'react'
import FeatureCard from './FeatureCard'

const features = [
  {
    icon: "local_shipping",
    title: "Free Shipping",
    description: "We ship all over India for FREE. Order now and get it delivered straight to your doorstep without extra shipping fees."
  },
  {
    icon: "verified",
    title: "Premium Products",
    description: "Our products are made of premium materials. Quality checked for high-fidelity aesthetics and durability."
  },
  {
    icon: "sell",
    title: "Exciting Offers",
    description: "We provide amazing offers & seasonal discounts. Get premium-crafted works at unbeatable rates."
  }
];

function FeatureGrid() {
  return (
    <section className=" bg-transparent">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid
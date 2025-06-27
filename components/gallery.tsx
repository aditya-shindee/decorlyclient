import React, { useState, useRef, useEffect } from 'react';

interface GalleryCard {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  size: 'large' | 'medium' | 'small';
  tags: string[];
}

const galleryItems: GalleryCard[] = [
  {
    id: 1,
    title: "Luxe Modern House",
    description: "Sophisticated contemporary design with premium finishes",
    image: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/generated-images/generated_image_1418c3d7bbc543699c324bcb47e64fa7.png?",
    category: "Living Room",
    size: 'large',
    tags: ['Modern', 'Luxury']
  },
  {
    id: 2,
    title: "Serene Master Suite",
    description: "Tranquil retreat with organic textures and ambient lighting",
    image: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/generated-images//93fac6a3-2108-4018-8b3e-2e4aed3a4f4c.png",
    category: "Bedroom",
    size: 'medium',
    tags: ['Cozy', 'Natural', 'Relaxing']
  },
  {
    id: 3,
    title: "Chef's Paradise",
    description: "Professional-grade kitchen with Italian marble and smart appliances",
    image: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//kitchen.png",
    category: "Kitchen",
    size: 'medium',
    tags: ['Professional', 'Marble', 'Smart']
  },
  {
    id: 4,
    title: "Executive Study",
    description: "Inspiring workspace with custom millwork",
    image: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/generated-images/generated_image_e23349a96ee24b1bb21fdc3bacfe9e9c.png?",
    category: "Office",
    size: 'small',
    tags: ['Productive', 'Custom', 'Executive']
  },
  {
    id: 5,
    title: "Spa Bathroom",
    description: "Resort-style sanctuary with stone",
    image: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/generated-images/generated_image_2ae860319a164ac99b0951bc28fc69d2.png?",
    category: "Bathroom",
    size: 'medium',
    tags: ['Spa', 'Stone', 'Luxury']
  },
  {
    id: 6,
    title: "Entertainment Lounge",
    description: "Ultimate entertainment space with cinema setup",
    image: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/generated-images//c6c702b1-04ae-4ee0-b198-0420e52f701a.png",
    category: "Entertainment",
    size: 'large',
    tags: ['Cinema', 'Entertainment', 'Modern']
  }
];

const GallerySection: React.FC<{ id: string }> = ({ id }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById(id);
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section 
      id={id} 
      className="relative min-h-screen pt-8 pb-20 px-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 overflow-hidden"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(59,130,246,0.2) 50%, transparent 100%)',
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-blue-200/30 to-cyan-200/30 blur-2xl animate-bounce"></div>
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-ping"
            style={{
              left: `${20 + (i * 8)}%`,
              top: `${30 + (i * 5)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + (i % 3)}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className={`text-center mb-8 transition-all duration-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="relative inline-block mb-4">
            <h2 className="relative text-4xl md:text-5xl font-light text-gray-700 leading-tight tracking-wider">
              Design <span className="font-medium text-purple-600">Gallery</span>
            </h2>
            {/* Subtle decorative elements */}
            <div className="flex items-center justify-center mt-3 space-x-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-60"></div>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
          </div>
        </div>

        {/* Advanced Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative group break-inside-avoid transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${index * 200}ms`,
              }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Container */}
              <div className={`relative overflow-hidden rounded-3xl backdrop-blur-sm border border-white/50 shadow-2xl transition-all duration-500 cursor-pointer ${
                item.size === 'large' ? 'h-96' : item.size === 'medium' ? 'h-80' : 'h-72'
              } ${
                hoveredCard === item.id 
                  ? 'transform scale-105 shadow-purple-500/20 border-purple-300/50' 
                  : 'hover:shadow-gray-300/50'
              }`}>
                
                {/* Glass Morphism Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/70 backdrop-blur-md"></div>
                
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      hoveredCard === item.id ? 'scale-110 brightness-110' : 'scale-100'
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${
                    hoveredCard === item.id ? 'opacity-50' : 'opacity-70'
                  }`}></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Category & Tags */}
                  <div className="mb-4 space-y-2">
                    <div className={`inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/40 text-white text-xs font-medium transition-all duration-300 ${
                      hoveredCard === item.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'
                    }`}>
                      {item.category}
                    </div>
                    
                    {/* Tags Row */}
                    <div className={`flex flex-wrap gap-1 transition-all duration-500 ${
                      hoveredCard === item.id ? 'opacity-100 translate-y-0 max-h-20' : 'opacity-0 translate-y-3 max-h-0 overflow-hidden'
                    }`}>
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-0.5 bg-white/60 backdrop-blur-sm rounded-md text-gray-700 text-xs border border-gray-300/40"
                          style={{ transitionDelay: `${tagIndex * 100}ms` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-white font-bold mb-3 transition-all duration-300 ${
                    item.size === 'large' ? 'text-2xl' : 'text-xl'
                  } ${
                    hoveredCard === item.id ? 'translate-y-0 text-purple-100' : 'translate-y-1'
                  }`}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-white text-sm leading-relaxed transition-all duration-500 ${
                    hoveredCard === item.id ? 'opacity-100 translate-y-0 max-h-32' : 'opacity-0 translate-y-2 max-h-0 overflow-hidden'
                  }`}>
                    {item.description}
                  </p>

                  {/* Interactive Elements */}
                  <div className={`mt-4 flex items-center justify-between transition-all duration-500 ${
                    hoveredCard === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 transition-opacity duration-500 ${
                  hoveredCard === item.id ? 'opacity-100' : ''
                }`}></div>

                {/* Shimmer Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000 ${
                  hoveredCard === item.id ? 'translate-x-full' : ''
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

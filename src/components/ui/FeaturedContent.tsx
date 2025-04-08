import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/translation';

interface FeaturedItemProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  delay?: number;
}

const FeaturedItem = ({ title, description, imageUrl, link, delay = 0 }: FeaturedItemProps) => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="glass-card overflow-hidden h-full flex flex-col group animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        {link && (
          <a 
            href={link} 
            className="text-institutional font-medium inline-flex items-center transition-all duration-300 group-hover:translate-x-1"
          >
            {t("Learn more")} <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        )}
      </div>
    </div>
  );
};

interface FeaturedContentProps {
  items: {
    title: string;
    description: string;
    imageUrl?: string;
    link: string;
  }[];
}

const FeaturedContent = ({ items }: FeaturedContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <FeaturedItem
          key={index}
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
          link={item.link}
          delay={0.1 * index}
        />
      ))}
    </div>
  );
};

export default FeaturedContent;

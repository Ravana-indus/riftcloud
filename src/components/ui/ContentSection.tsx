import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translation';

interface ContentSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  background?: 'white' | 'gray-50' | 'gray-100';
  titleAlignment?: 'left' | 'center';
  titleSize?: 'default' | 'large';
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageCopyright?: string;
  isHero?: boolean;
  translateTitle?: boolean;
  translateSubtitle?: boolean;
}

const ContentSection = ({
  id,
  title,
  subtitle,
  children,
  className,
  fullWidth = false,
  background = 'white',
  titleAlignment = 'center',
  titleSize = 'default',
  imageUrl,
  imageAlt = '',
  imageCaption,
  imageCopyright,
  isHero = false,
  translateTitle = true,
  translateSubtitle = true,
}: ContentSectionProps) => {
  const backgroundClasses = {
    'white': 'bg-white',
    'gray-50': 'bg-gray-50',
    'gray-100': 'bg-gray-100',
  };
  
  const hasImage = Boolean(imageUrl);
  const { t } = useTranslation();
  
  return (
    <section 
      id={id} 
      className={cn(
        "flex flex-col relative",
        hasImage ? "pt-0" : "py-20", 
        backgroundClasses[background],
        className
      )}
    >
      {hasImage && (
        <div className={cn(
          "w-full order-1",
          !isHero && "container-xxxl"
        )}>
          <figure 
            aria-labelledby={`figcaption-${id}`} 
            className={cn(
              "relative w-full overflow-hidden",
              !isHero && "image-wrapper has-dimmer dimmer-strong dimmer-totop"
            )}
          >
            <picture>
              <source 
                type="image/webp" 
                srcSet={`${imageUrl}?format=webp&w=160 160w, ${imageUrl}?format=webp&w=320 320w, ${imageUrl}?format=webp&w=480 480w, ${imageUrl}?format=webp&w=640 640w, ${imageUrl}?format=webp&w=800 800w, ${imageUrl}?format=webp&w=960 960w, ${imageUrl}?format=webp&w=1120 1120w, ${imageUrl}?format=webp&w=1280 1280w, ${imageUrl}?format=webp&w=1440 1440w, ${imageUrl}?format=webp&w=1600 1600w`}
                sizes="(min-width: 1600px) 1600px, (min-width: 1440px) 1440px, (min-width: 1280px) 1280px, (min-width: 1120px) 1120px, (min-width: 960px) 960px, (min-width: 800px) 800px, (min-width: 640px) 640px, (min-width: 480px) 480px, (min-width: 320px) 320px, 160px"
              />
              <img 
                src={imageUrl} 
                alt={imageAlt ? (translateTitle ? t(imageAlt) : imageAlt) : ''}
                width="2300"
                height="1000"
                className={cn(
                  "w-full object-cover img-fluid",
                  isHero ? "h-[650px] md:h-[780px] px-0 sm:px-5 2xl:px-20" : "h-[520px] md:h-[650px] px-0 sm:px-5 2xl:px-20",
                )}
                loading="lazy"
                sizes="(min-width: 1600px) 1600px, (min-width: 1440px) 1440px, (min-width: 1280px) 1280px, (min-width: 1120px) 960px, (min-width: 960px) 960px, (min-width: 800px) 800px, (min-width: 640px) 640px, (min-width: 480px) 480px, (min-width: 320px) 320px, 160px"
              />
            </picture>
            {!isHero && (
              <>
                {imageCopyright && (
                  <p className="m-0 absolute bottom-4 right-4 z-10">
                    <small className="text-white text-xs opacity-80">{imageCopyright}</small>
                  </p>
                )}
              </>
            )}
          </figure>
        </div>
      )}
      
      <div className={cn(
        "container-content relative px-10",
        hasImage ? "-mt-12 md:-mt-24 order-2 mb-20" : ""
      )}>
        <div className={cn(
          "max-w-3xl px-4",
          hasImage ? "bg-white p-4 md:p-6 shadow-md relative z-20" : "",
          titleAlignment === 'center' ? 'text-center mx-auto' : 'text-left',
          hasImage ? "mb-8" : "mb-12"
        )}>
          <h2 className={cn(
            "section-heading animate-fade-up",
            titleSize === 'large' && "text-4xl sm:text-5xl font-bold",
            hasImage && "mt-2"
          )}>
            {translateTitle ? t(title) : title}
          </h2>
          {subtitle && (
            <p className="section-subheading animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {translateSubtitle ? t(subtitle) : subtitle}
            </p>
          )}
        </div>
        <div className={fullWidth ? 'w-full' : 'px-4'}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;

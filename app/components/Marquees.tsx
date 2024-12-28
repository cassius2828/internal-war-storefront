'use client';

import {Image} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';

const imageLinkArray: string[] = [
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5300.jpg?v=1732660176',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5372.jpg?v=1732660149',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/20240218_145459_ECD716.jpg?v=1708479381',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5488.jpg?v=1732660159',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5300.jpg?v=1732660176',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5372.jpg?v=1732660149',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/20240218_145459_ECD716.jpg?v=1708479381',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5488.jpg?v=1732660159',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5300.jpg?v=1732660176',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5372.jpg?v=1732660149',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/20240218_145459_ECD716.jpg?v=1708479381',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5488.jpg?v=1732660159',
];

export const BasicMarquee: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  useEffect(() => {
    setWindowWidth(window?.innerWidth);
  }, []);
  return (
    <section
      className={
        windowWidth > 768
          ? 'marquee-animation-desktop'
          : 'marquee-animation-mobile'
      }
    >
      <div className="relative flex overflow-hidden gap-4 w-full md:w-3/4 mx-auto ">
        <ul className="shrink-0 flex justify-around gap-4 min-w-full">
          {imageLinkArray.map((imgLink: string, idx: number) => {
            return (
              <li className="h-96" key={imgLink + idx}>
                <Image
                  className="object-cover"
                  width={300}
                  height={400}
                  src={imgLink}
                  alt={idx + 'test'}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

// start with extraction then go to processing | DE

// something in open source | any contribution

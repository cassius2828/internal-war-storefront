import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const newsSlides = [
  {
    title: 'Worlds worst Expo. sacramento, ca',
    img: 'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/wwe-sample-img.jpg?v=1733181992',
    alt: 'tent at worlds worst expo',
    link: '',
  },
  {
    title: 'Winter Collection Launch Party - NYC',
    img: 'https://example.com/images/winter-collection.jpg',
    alt: 'Models showcasing winter collection in NYC',
    link: '/collections/winter',
  },
  {
    title: 'Behind the Scenes - Fall Lookbook Shoot',
    img: 'https://example.com/images/fall-lookbook.jpg',
    alt: 'Photographer capturing fall lookbook shoot',
    link: '/lookbook/fall',
  },
  {
    title: 'Limited Edition Release - Streetwear Essentials',
    img: 'https://example.com/images/streetwear-essentials.jpg',
    alt: 'Streetwear essentials displayed at pop-up event',
    link: '/limited-edition',
  },
];

const NewsCarousel = () => {
  return (
    <div className="flex flex-col bg-neutral-900 justify-center items-center text-gray-100 py-12">
      {/* grpoup 1 */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full relative">
        <span className="pointer-events-none uppercase font-thin md:[writing-mode:vertical-lr] md:rotate-180 text-2xl tracking-[8px] md:absolute mb-6 md:mb-0 left-24">
          behind the lines
        </span>
        <img
          fetchPriority="low"
          loading="lazy"
          className="w-3/4 aspect-[5/2] object-cover"
          src={newsSlides[0].img}
          alt={newsSlides[0].alt}
        />
      </div>
      {/* goroup 2 */}
      <div className="flex justify-between gap-12  w-3/4 mt-6">
        {/* gropup 3a */}
        <div className="flex flex-col items-start justify-between gap-6 ">
          <span className="uppercase">{newsSlides[0].title}</span>
          <span className="border-b pb-2 uppercase">discover</span>
        </div>
        {/* gorup 3b */}
        <div className="flex justify-center items-center gap-8">
          <FontAwesomeIcon
            className="cursor-pointer"
            size="xl"
            icon={faArrowLeft}
          />
          <FontAwesomeIcon
            className="cursor-pointer"
            size="xl"
            icon={faArrowRight}
          />
        </div>
      </div>
    </div>
  );
};
export default NewsCarousel;

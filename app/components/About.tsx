'use client';

import {useState} from 'react';
import {Dialog, DialogPanel} from '@headlessui/react';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import {Image} from '@shopify/hydrogen';

const navigation = [
  {name: 'Product', href: '#'},
  {name: 'Features', href: '#'},
  {name: 'Resources', href: '#'},
  {name: 'Company', href: '#'},
];
const stats = [
  {label: 'Sales in 2024', value: '1000+'},
  {label: 'Followers on social media', value: '3000+'},
  {label: 'Registered Users', value: '100+'},
];
const values = [
  {
    name: 'Originality Above All',
    description:
      'We create what the world hasn’t seen before. We push boundaries, break molds, and challenge expectations. Our designs are not trends—they are statements of self-expression and individuality.',
  },
  {
    name: 'Embrace Rebellion',
    description:
      'We don’t follow the rules; we break them. Rebellion is in our DNA. We challenge the mainstream and embrace the power of defiance, using fashion as a tool for self-expression and cultural revolution.',
  },
  {
    name: 'Art is Our Weapon',
    description:
      'Fashion is our canvas. Every collection is a work of art—bold, raw, and unapologetic. We merge street culture, art, and style to create pieces that speak louder than words.',
  },
  {
    name: 'Build a Movement',
    description:
      'It’s more than just clothing; it’s a revolution. We’re not here to be liked—we’re here to inspire a movement. We create with the intention of sparking conversation and igniting passion in everyone who wears our pieces.',
  },
  {
    name: 'Fight for Authenticity',
    description:
      'In a world full of replicas, we stand for authenticity. We refuse to conform to industry standards and choose instead to embrace what’s real, raw, and true to the culture we represent.',
  },
  {
    name: 'Stay Relentless',
    description:
      'The battle never ends. Our journey is about constant growth, pushing limits, and never settling for mediocrity. We embrace struggle as part of our evolution, always striving for more, always staying relentless.',
  },
];
const founderQuote = `
<p class="mt-6 text-lg/8 text-gray-600">Internal War started with a vision—creating pieces that aren’t just clothing, 
but expressions of defiance and individuality. We were inspired by the raw energy of street culture, 
where every piece tells a story. We wanted to break the mold, challenge the norms, 
and bring something authentic to the streets.</p>
</br>
<p class="mt-6 text-lg/8 text-gray-600">Where we’re headed? We’re just getting started. Our mission is to continue pushing boundaries 
and collaborating with the next generation of creative rebels. We’re not just about fashion—we’re about 
shaping culture, igniting conversation, and making a mark on the world.</p>
`;
const team = [
  {
    name: 'Lucca Sartorio',
    role: 'Founder / CEO',

    imageUrl:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5515.jpg?v=1732660174',
  },
  // More people...
];
const blogPosts = [
  {
    id: 1,
    title: 'Vel expedita assumenda placeat aut nisi optio voluptates quas',
    href: '#',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/wwe-sample-img.jpg?v=1733181992',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    author: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  // More posts...
];

const landingImages = [
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/20240218_145459_E3FD09.jpg?v=1708490463',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5512.jpg?v=1732660175',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5247.jpg?v=1732660176',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5355.jpg?v=1732660175',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5216.jpg?v=1732660176',
  'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5229.jpg?v=1732660174',
];
export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white md:mt-12">
      <main className="isolate newsreader">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <svg
            style={{height: '64rem'}}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                width: '50.0625rem',
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
              //   className="aspect-[801/1036] bg-gradient-to-tr from-[#b6b6b6] to-[#5b5b5b] opacity-30"
              className="aspect-[801/1036] bg-gradient-to-tr from-[#eaa9c4] to-[#ec79ea] opacity-30"
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1
                    style={{fontSize: '1.5rem'}}
                    className="text-pretty font-semibold tracking-tight text-gray-900 "
                  >
                    What is Internal War?
                  </h1>
                  <p
                    style={{lineHeight: '40px'}}
                    className="mt-8 text-pretty text-xl font-medium text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none "
                  >
                    We are a street-wear brand born from the tension between
                    individuality and societal expectations, where fashion meets
                    the fight for self-expression. Our mission is to equip our
                    community of wearers with more than just clothing — we offer
                    armor for the internal battles we all face.
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Image
                        fetchPriority="high"
                        loading="eager"
                        alt=""
                        src={landingImages[0]}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        fetchPriority="high"
                        loading="eager"
                        alt=""
                        src={landingImages[1]}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        fetchPriority="high"
                        loading="eager"
                        alt=""
                        src={landingImages[2]}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Image
                        fetchPriority="high"
                        loading="eager"
                        alt=""
                        src={landingImages[3]}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        fetchPriority="high"
                        loading="eager"
                        alt=""
                        src={landingImages[4]}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h3 className="text-pretty text-2xl font-semibold tracking-tight text-gray-900">
              Inspired by
            </h3>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p
                  style={{lineHeight: '40px'}}
                  className="text-xl/8 text-gray-600"
                >
                  Inspired by the raw energy of street culture and the
                  ever-present struggles of identity, Internal War represents
                  the conflict between personal authenticity and external
                  pressures. Every piece in our collection is a reflection of
                  the grind, resilience, and creativity that fuels our
                  generation. We craft designs that are bold, unapologetic, and
                  rooted in the stories of those who dare to live on their own
                  terms.
                </p>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col-reverse gap-y-4"
                    >
                      <dt className="text-base/7 text-gray-600">
                        {stat.label}
                      </dt>
                      <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
          <Image
            loading="lazy"
            fetchPriority="low"
            alt=""
            src={landingImages[5]}
            className="aspect-[5/2] w-full  object-cover xl:rounded-3xl about-horizontal-img"
          />
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h3 className="text-pretty text-2xl font-semibold tracking-tight text-gray-900">
              Our process
            </h3>
            <p className="mt-6 text-lg/8 text-gray-600">
              Our process isn’t just about creating fashion — it’s about
              channeling the war inside all of us into wearable art. Each
              collection is a canvas for exploring new ideas, clashing styles,
              and the fusion of art and rebellion. From concept to design, our
              team lives the culture, fights for originality, and ensures that
              each drop represents a deeper story of struggle, perseverance, and
              victory.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base/7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name}>
                <dt className="font-semibold text-gray-900">{value.name}</dt>
                <dd className="mt-1 text-gray-600">{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Logo cloud */}
        <div className="relative isolate -z-10 mt-32 sm:mt-48">
          <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
            <svg
              style={{height: '40rem', width: '80rem'}}
              aria-hidden="true"
              className="flex-none stroke-gray-200"
            >
              <defs>
                <pattern
                  x="50%"
                  y="50%"
                  id="e9033f3e-f665-41a6-84ef-756f6778e6fe"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                  patternTransform="translate(-100 0)"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y="50%" className="overflow-visible fill-gray-50">
                <path
                  d="M-300 0h201v201h-201Z M300 200h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"
                width="100%"
                height="100%"
                strokeWidth={0}
              />
            </svg>
          </div>
        </div>

        {/* Team section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h3 className="text-pretty text-2xl font-semibold tracking-tight text-gray-900 ">
              Our Journey
            </h3>

            <div
              className="mt-4"
              dangerouslySetInnerHTML={{__html: founderQuote}}
            />
          </div>
          <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6">
            {team.map((person) => (
              <li key={person.name}>
                <img
                  loading="lazy"
                  fetchPriority="low"
                  alt="Founder"
                  src={person.imageUrl}
                  className="mx-auto size-48 rounded-full object-cover"
                />
                <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-sm/6 text-gray-600">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Blog section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Behind the Lines
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600">
              Inside look at our recent events, media, and more
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <img
                  alt="News Carousel"
                  loading="lazy"
                  fetchPriority="low"
                  src={post.imageUrl}
                  className="absolute inset-0 -z-10 size-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                  <time dateTime={post.datetime} className="mr-8">
                    {post.date}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4"></div>
                </div>
                <h3 className="mt-3 text-lg/6 font-semibold text-white">
                  <a href={post.href}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

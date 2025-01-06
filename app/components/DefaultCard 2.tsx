import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

interface DefaultCardWithLinkProps {
  img: string;
  title: string;
  altText: string;
  link: string;
  price: string;
  id: string | number;
}

const DefaultCardWithLink: React.FC<DefaultCardWithLinkProps> = ({
  img,
  title,
  altText,
  link,
  price,
  id,
}) => {
  return (
    <Link
      className="collection-item shadow-md rounded-md p-3 transition-all duration-300 hover:shadow-lg hover:bg-transparent"
      key={id}
      to={link}
      prefetch="intent"
    >
      <span aria-hidden="true" className="inset-0">
        <Image
          className={`object-cover fade-in`}
          alt={altText}
          aspectRatio="1/1"
          src={img}
          loading="lazy"
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </span>
      <span className="relative mt-auto text-center text-xl font-bold text-neutral-900 ">
        {title}
      </span>
      <span className="relative mt-auto text-center text-xl font-bold text-neutral-900 ">
        {price}
      </span>
    </Link>
  );
};

export default DefaultCardWithLink;

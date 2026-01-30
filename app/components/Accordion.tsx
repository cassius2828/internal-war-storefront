import {useState, useRef, useEffect} from 'react';

interface AccordionProps {
  descriptionHtml: string;
  title: string;
  defaultOpen?: boolean;
  icon?: 'product' | 'shipping' | 'returns' | 'care';
}

// Icon components for different accordion types
const ProductIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const ShippingIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
    />
  </svg>
);

const ReturnsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
    />
  </svg>
);

const CareIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const getIcon = (iconType?: string) => {
  switch (iconType) {
    case 'product':
      return <ProductIcon />;
    case 'shipping':
      return <ShippingIcon />;
    case 'returns':
      return <ReturnsIcon />;
    case 'care':
      return <CareIcon />;
    default:
      return null;
  }
};

const Accordion: React.FC<AccordionProps> = ({
  descriptionHtml,
  title,
  defaultOpen = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [descriptionHtml]);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full border-b border-neutral-200">
      <h2>
        <button
          type="button"
          className="
            flex items-center justify-between w-full py-5
            text-sm font-light tracking-wide text-neutral-900
            transition-colors duration-200
            hover:text-neutral-600
            focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset
          "
          aria-expanded={isOpen}
          onClick={toggleAccordion}
        >
          <span className="flex items-center gap-3 uppercase">
            {icon && (
              <span className="text-neutral-400">{getIcon(icon)}</span>
            )}
            {title}
          </span>
          <svg
            className={`
              w-4 h-4 text-neutral-500 transition-transform duration-300 ease-out
              ${isOpen ? 'rotate-180' : 'rotate-0'}
            `}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </h2>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{height: isOpen ? contentHeight : 0}}
      >
        <div
          ref={contentRef}
          className="pb-6 text-sm text-neutral-600 leading-relaxed"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </div>
    </div>
  );
};

export default Accordion;

export const ProductDetailsAccordion: React.FC<AccordionProps> = ({
  descriptionHtml,
  title,
  defaultOpen = true,
  icon = 'product',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [descriptionHtml]);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        className="
          group flex items-center justify-between w-full py-5
          text-sm font-medium tracking-wide text-neutral-900
          transition-colors duration-200
          hover:text-neutral-600
          focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset
        "
        aria-expanded={isOpen}
        onClick={toggleAccordion}
      >
        <span className="flex items-center gap-3">
          <span className={`
            flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
            ${isOpen 
              ? 'bg-neutral-900 text-white' 
              : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
            }
          `}>
            {getIcon(icon)}
          </span>
          <span className="uppercase">{title}</span>
        </span>
        <svg
          className={`
            w-4 h-4 text-neutral-500 transition-transform duration-300 ease-out
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{height: isOpen ? contentHeight : 0}}
      >
        <div
          ref={contentRef}
          className="
            pb-6 pl-11
            text-sm text-neutral-600 leading-relaxed
            [&_p]:mb-3 [&_p:last-child]:mb-0
            [&_ul]:space-y-2 [&_ul]:mb-3 [&_ul]:list-none [&_ul]:pl-0
            [&_li]:relative [&_li]:pl-5 [&_li]:py-0.5
            [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0
            [&_li]:before:top-[0.65em] [&_li]:before:w-1.5 [&_li]:before:h-1.5
            [&_li]:before:bg-neutral-300 [&_li]:before:rounded-full
          "
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </div>
    </div>
  );
};

export const ShippingDetailsAccordion: React.FC<AccordionProps> = ({
  descriptionHtml,
  title,
  defaultOpen = false,
  icon = 'shipping',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [descriptionHtml]);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        className="
          group flex items-center justify-between w-full py-5
          text-sm font-medium tracking-wide text-neutral-900
          transition-colors duration-200
          hover:text-neutral-600
          focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset
        "
        aria-expanded={isOpen}
        onClick={toggleAccordion}
      >
        <span className="flex items-center gap-3">
          <span className={`
            flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
            ${isOpen 
              ? 'bg-neutral-900 text-white' 
              : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
            }
          `}>
            {getIcon(icon)}
          </span>
          <span className="uppercase">{title}</span>
        </span>
        <svg
          className={`
            w-4 h-4 text-neutral-500 transition-transform duration-300 ease-out
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{height: isOpen ? contentHeight : 0}}
      >
        <div
          ref={contentRef}
          className="
            pb-6 pl-11
            text-sm text-neutral-600 leading-relaxed
            [&_p]:mb-3 [&_p:last-child]:mb-0
            [&_ul]:space-y-2.5 [&_ul]:mb-3 [&_ul]:list-none [&_ul]:pl-0
            [&_li]:relative [&_li]:pl-6 [&_li]:py-0.5
            [&_li]:before:content-['✓'] [&_li]:before:absolute [&_li]:before:left-0
            [&_li]:before:text-green-600 [&_li]:before:font-semibold [&_li]:before:text-xs
          "
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </div>
    </div>
  );
};

// Legacy component for backwards compatibility
export const ShippingDetailsHTML: React.FC<AccordionProps> = ({
  descriptionHtml,
  title,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [descriptionHtml]);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        className="
          flex items-center justify-between w-full py-5
          text-sm font-light tracking-wide text-neutral-900
          transition-colors duration-200
          hover:text-neutral-600
          focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset
        "
        aria-expanded={isOpen}
        onClick={toggleAccordion}
      >
        <span className="uppercase">{title}</span>
        <svg
          className={`
            w-4 h-4 text-neutral-500 transition-transform duration-300 ease-out
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{height: isOpen ? contentHeight : 0}}
      >
        <div
          ref={contentRef}
          className="pb-6 text-sm text-neutral-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-neutral-600"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </div>
    </div>
  );
};

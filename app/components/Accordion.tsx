import {useState, useRef, useEffect} from 'react';

interface AccordionProps {
  descriptionHtml: string;
  title: string;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
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

import {useState} from 'react';

interface AccordionProps {
  descriptionHtml: string; // Type for descriptionHtml
  title: string; // Type for descriptionHtml
}

const Accordion: React.FC<AccordionProps> = ({descriptionHtml, title}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Toggle the accordion open/close state
  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      id="accordion-collapse"
      className="w-96 border-b border-gray-300  "
      data-accordion="collapse"
    >
      <h2 id="accordion-collapse-heading-1">
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-gray-700   rounded-t-xl focus:border focus:border-gray-300 hover:border-gray-100 gap-3"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls="accordion-collapse-body-1"
          onClick={toggleAccordion}
        >
          <span>{title}</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transition-transform transform shrink-0 ${
              isOpen ? '' : 'rotate-180'
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      {isOpen && (
        <div
          id="accordion-collapse-body-1"
          aria-labelledby="accordion-collapse-heading-1"
        >
          <div
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
            className="p-5 bg-white"
          ></div>
        </div>
      )}
    </div>
  );
};

export default Accordion;

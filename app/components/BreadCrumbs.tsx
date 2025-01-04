'use client';
import {HomeIcon} from '@heroicons/react/20/solid';
import {useParams} from '@remix-run/react';
import {useEffect} from 'react';
interface BreadcrumbsProps {
  pageType: string;
}
// you get the handle by default, you choose the prefix based on file location manually
export default function Breadcrumbs({pageType}: BreadcrumbsProps) {
  const path = useParams();
  // * For now this satisfies all potential product / collection pages
  const pages = [
    {
      name: pageType,
      href: `/${pageType}`,
      current: false,
    },
    {name: path.handle, href: `/${pageType}/${path.handle}`, current: true},
  ];
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <a href="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="size-5 shrink-0 text-gray-300"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <a
                href={page.href}
                aria-current={page.current ? 'page' : undefined}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

const buttonBaseStyles = `
  w-full mt-6 py-4 text-sm font-medium tracking-widest uppercase
  transition-all duration-300 ease-out
  focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const buttonEnabledStyles = `
  bg-neutral-900 text-white
  hover:bg-neutral-800 active:scale-[0.98]
`;

const buttonDisabledStyles = `
  bg-neutral-300 text-neutral-500
`;

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isLoading = fetcher.state !== 'idle';
        const isDisabled = disabled || isLoading;

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />

            <button
              type="submit"
              onClick={onClick}
              disabled={isDisabled}
              className={`
                ${buttonBaseStyles}
                ${isDisabled ? buttonDisabledStyles : buttonEnabledStyles}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                children
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}

export function AddToCartButtonNoSubmit({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isLoading = fetcher.state !== 'idle';
        const isDisabled = disabled || isLoading;

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />

            <button
              type="button"
              onClick={(e) => {
                if (onClick) onClick();
                e.preventDefault();
              }}
              disabled={isDisabled}
              className={`
                ${buttonBaseStyles}
                ${isDisabled ? buttonDisabledStyles : buttonEnabledStyles}
              `}
            >
              {children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}

// vite.config.ts
import { defineConfig } from "file:///Users/cassiusreynolds/Desktop/coding/clients/lucca/internal-war-storefront/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///Users/cassiusreynolds/Desktop/coding/clients/lucca/internal-war-storefront/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///Users/cassiusreynolds/Desktop/coding/clients/lucca/internal-war-storefront/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///Users/cassiusreynolds/Desktop/coding/clients/lucca/internal-war-storefront/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///Users/cassiusreynolds/Desktop/coding/clients/lucca/internal-war-storefront/node_modules/vite-tsconfig-paths/dist/index.mjs";
import tailwindcss from "file:///Users/cassiusreynolds/Desktop/coding/clients/lucca/internal-war-storefront/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }),
    tsconfigPaths()
  ],
  build: {
    assetsInlineLimit: 0
  },
  ssr: {
    external: ["crypto", "assert", "cookie-signature", "undici"],
    optimizeDeps: {
      include: ["prop-types"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2Fzc2l1c3JleW5vbGRzL0Rlc2t0b3AvY29kaW5nL2NsaWVudHMvbHVjY2EvaW50ZXJuYWwtd2FyLXN0b3JlZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jYXNzaXVzcmV5bm9sZHMvRGVza3RvcC9jb2RpbmcvY2xpZW50cy9sdWNjYS9pbnRlcm5hbC13YXItc3RvcmVmcm9udC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2Fzc2l1c3JleW5vbGRzL0Rlc2t0b3AvY29kaW5nL2NsaWVudHMvbHVjY2EvaW50ZXJuYWwtd2FyLXN0b3JlZnJvbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSc7XG5pbXBvcnQge2h5ZHJvZ2VufSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJztcbmltcG9ydCB7b3h5Z2VufSBmcm9tICdAc2hvcGlmeS9taW5pLW94eWdlbi92aXRlJztcbmltcG9ydCB7dml0ZVBsdWdpbiBhcyByZW1peH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgICBoeWRyb2dlbigpLFxuICAgIG94eWdlbigpLFxuICAgIHJlbWl4KHtcbiAgICAgIHByZXNldHM6IFtoeWRyb2dlbi5wcmVzZXQoKV0sXG4gICAgICBmdXR1cmU6IHtcbiAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxuICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXG4gIH0sXG4gIHNzcjoge1xuICAgIGV4dGVybmFsOiBbJ2NyeXB0bycsICdhc3NlcnQnLCAnY29va2llLXNpZ25hdHVyZScsICd1bmRpY2knXSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsncHJvcC10eXBlcyddLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVosU0FBUSxvQkFBbUI7QUFDOWEsU0FBUSxnQkFBZTtBQUN2QixTQUFRLGNBQWE7QUFDckIsU0FBUSxjQUFjLGFBQVk7QUFDbEMsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxpQkFBaUI7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLFNBQVMsT0FBTyxDQUFDO0FBQUEsTUFDM0IsUUFBUTtBQUFBLFFBQ04sbUJBQW1CO0FBQUEsUUFDbkIsc0JBQXNCO0FBQUEsUUFDdEIscUJBQXFCO0FBQUEsTUFDdkI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsbUJBQW1CO0FBQUEsRUFDckI7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFVBQVUsQ0FBQyxVQUFVLFVBQVUsb0JBQW9CLFFBQVE7QUFBQSxJQUMzRCxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsWUFBWTtBQUFBLElBQ3hCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

import { demoResults } from "@/lib/demo-results";

type PrefetchRouter = {
  prefetch: (href: string) => void;
};

const authenticatedRoutes = [
  "/dashboard",
  "/results",
  "/about",
  "/profile",
  ...demoResults.map((result) => `/results/${result.id}`),
];

type RouteDetectionResult = {
  route: string;
  status: number | "error";
  duration: string;
  bytes: number | "-";
};

async function detectAuthenticatedRoutes() {
  const startedAt = performance.now();

  const results = await Promise.all(
    authenticatedRoutes.map(async (route): Promise<RouteDetectionResult> => {
      const routeStartedAt = performance.now();

      try {
        const response = await fetch(route, {
          cache: "force-cache",
          credentials: "same-origin",
        });
        const body = await response.text();

        return {
          route,
          status: response.status,
          duration: `${(performance.now() - routeStartedAt).toFixed(2)}ms`,
          bytes: body.length,
        };
      } catch {
        return {
          route,
          status: "error",
          duration: `${(performance.now() - routeStartedAt).toFixed(2)}ms`,
          bytes: "-",
        };
      }
    }),
  );

  console.groupCollapsed("[LukaScope] route detection timings");
  console.table(results);
  console.log(`Detected ${results.length} routes in ${(performance.now() - startedAt).toFixed(2)}ms`);
  console.groupEnd();
}

export function prefetchAuthenticatedRoutes(router: PrefetchRouter) {
  const startedAt = performance.now();
  let scheduled = 0;

  console.groupCollapsed("[LukaScope] route prefetch");

  authenticatedRoutes.forEach((route) => {
    const routeStartedAt = performance.now();
    try {
      router.prefetch(route);
      scheduled += 1;
      console.log(`${route} scheduled in ${(performance.now() - routeStartedAt).toFixed(2)}ms`);
    } catch (error) {
      console.warn(`${route} failed to schedule`, error);
    }
  });

  console.log(
    `${scheduled}/${authenticatedRoutes.length} routes scheduled in ${(performance.now() - startedAt).toFixed(2)}ms`,
  );
  console.log("Next.js App Router does not expose exact prefetch completion timing.");
  console.groupEnd();

  void detectAuthenticatedRoutes();
}

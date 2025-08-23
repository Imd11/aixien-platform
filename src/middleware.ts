import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 定义需要保护的路由 - 只保护功能页面，主页允许浏览
const isProtectedRoute = createRouteMatcher([
  '/hypermind(.*)',
  '/diagnose(.*)',
  '/strategy(.*)',
  '/tools/voice-to-text(.*)',
  '/api(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // 只对功能页面要求登录，主页允许浏览
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
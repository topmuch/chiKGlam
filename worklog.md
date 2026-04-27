---
Task ID: 1
Agent: Main Agent
Task: Implement template system with Gold theme and homepage product limits for chiKGlam

Work Log:
- Read and analyzed the entire codebase architecture (19 files)
- Added `activeTemplate` field to Prisma SiteSettings model
- Updated Settings API to allow `activeTemplate` in allowed fields
- Pushed schema to database with `bun run db:push`
- Added `activeTemplate` + `setActiveTemplate` to Zustand store with localStorage persistence
- Created `useTemplate` hook that auto-fetches template from API on mount
- Added "Template" tab in Admin Dashboard Settings with visual selector (Original / Gold)
- Applied conditional Gold (#bc8752) theme to 8 components: Header, CategoriesGrid, TrendingProducts, NewArrivals, PromoDualBanner, CustomerFeedback, Footer, HomePage NewsletterBanner
- Limited TrendingProducts from 6 to 4 products (.slice(0, 4))
- Limited NewArrivals from 6 to 4 products (.slice(0, 4))
- Verified lint passes (only pre-existing seed.js error)
- Verified homepage compiles and serves correctly (HTTP 200, 144KB HTML)
- Verified Settings API returns activeTemplate field

Stage Summary:
- Template system fully implemented with 2 themes: Default (original) and Gold (#bc8752)
- Admin can select template from Paramètres > Template tab
- Template selection persists in DB + localStorage
- Gold theme changes: promo banner bg, section titles, underline accents, ACHETER button, footer bg, newsletter section bg, CustomerFeedback section bg, social icons
- Homepage product counts reduced from 6 to 4 in both trending and newArrivals sections

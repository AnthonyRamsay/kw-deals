import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-brand-400">KW</span>
              <span className="text-xl font-bold text-white">Deals</span>
            </div>
            <p className="text-sm text-stone-400 max-w-xs">
              Discover the best deals, discounts, and new businesses in Kitchener-Waterloo. Powered by KW Rising.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/food-and-drink" className="text-sm hover:text-white transition-colors">Food & Drink</Link></li>
              <li><Link href="/category/retail" className="text-sm hover:text-white transition-colors">Retail</Link></li>
              <li><Link href="/category/services" className="text-sm hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/category/entertainment" className="text-sm hover:text-white transition-colors">Entertainment</Link></li>
              <li><Link href="/category/new-openings" className="text-sm hover:text-white transition-colors">New Openings</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Info</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">For Businesses</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-sm text-stone-500">
          &copy; {new Date().getFullYear()} KW Deals by KW Rising. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

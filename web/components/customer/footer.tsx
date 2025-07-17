import Link from "next/link";

export function CustomerFooter() {
  return (
    <footer className="border-t bg-background w-full">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">POS System</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A modern point of sale system for restaurants and retail businesses.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-foreground">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <address className="mt-2 not-italic text-sm text-muted-foreground">
              <p>123 Restaurant Street</p>
              <p>Jakarta, Indonesia</p>
              <p className="mt-2">contact@possystem.com</p>
              <p>+62 123 4567 890</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} POS System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

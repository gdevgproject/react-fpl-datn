import Link from "next/link"
import { Home, Package, ShoppingCart, Users, Settings, Tag, Layers } from "lucide-react"

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-white">Admin</h1>
      </div>
      <ul className="flex flex-col py-4">
        <li>
          <Link
            href="/admin"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Home />
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/products"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Package />
            </span>
            <span className="text-sm font-medium">Products</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/categories"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Layers />
            </span>
            <span className="text-sm font-medium">Categories</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/brands"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Tag />
            </span>
            <span className="text-sm font-medium">Brands</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <ShoppingCart />
            </span>
            <span className="text-sm font-medium">Orders</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/users"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Users />
            </span>
            <span className="text-sm font-medium">Users</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/settings"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Settings />
            </span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}


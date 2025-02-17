import { v4 as uuidv4 } from "uuid"

export interface Address {
  id: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  gender: "male" | "female" | "unisex"
  ingredients: string
  origin: string
  volume: string
  stock: number
  images: string[]
  status: "active" | "hidden"
}

export interface Order {
  id: string
  userId: string
  products: { productId: string; quantity: number }[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  role: "admin" | "user"
  status: "active" | "inactive" | "blocked"
  phone: string
  registeredAt: string
  defaultAddress: Address
  addresses: Address[]
  totalOrders: number
  totalSpent: number
}

export interface Category {
  id: string
  name: string
  parentId: string | null
  children: Category[]
}

export interface Attribute {
  id: string
  name: string
  type: "text" | "select" | "number"
  values: string[]
}

export interface Brand {
  id: string
  name: string
  description: string
  logo: string
}

export const products: Product[] = [
  {
    id: uuidv4(),
    name: "Ocean Breeze",
    description: "A fresh and invigorating scent reminiscent of the sea.",
    price: 89.99,
    category: "Perfume",
    gender: "unisex",
    ingredients: "Alcohol, Aqua, Parfum, Limonene, Linalool",
    origin: "France",
    volume: "100ml",
    stock: 50,
    images: ["/placeholder.svg?height=200&width=200"],
    status: "active",
  },
  {
    id: uuidv4(),
    name: "Midnight Rose",
    description: "A seductive and mysterious fragrance for evenings.",
    price: 120.0,
    category: "Perfume",
    gender: "female",
    ingredients: "Alcohol, Aqua, Parfum, Rose Extract, Patchouli Oil",
    origin: "Italy",
    volume: "75ml",
    stock: 30,
    images: ["/placeholder.svg?height=200&width=200"],
    status: "active",
  },
  // Add more mock products as needed
]

export const orders: Order[] = [
  {
    id: uuidv4(),
    userId: "user1",
    products: [
      { productId: "product1", quantity: 2 },
      { productId: "product2", quantity: 1 },
    ],
    totalAmount: 150.99,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    userId: "user2",
    products: [{ productId: "product3", quantity: 1 }],
    totalAmount: 79.99,
    status: "processing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  },
  {
    id: uuidv4(),
    userId: "user3",
    products: [
      { productId: "product1", quantity: 1 },
      { productId: "product4", quantity: 3 },
    ],
    totalAmount: 220.97,
    status: "shipped",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: uuidv4(),
    userId: "user4",
    products: [{ productId: "product2", quantity: 2 }],
    totalAmount: 159.98,
    status: "delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: uuidv4(),
    userId: "user5",
    products: [{ productId: "product5", quantity: 1 }],
    totalAmount: 99.99,
    status: "cancelled",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
]

// Add more mock orders (total 20)
for (let i = 0; i < 15; i++) {
  orders.push({
    id: uuidv4(),
    userId: `user${i + 6}`,
    products: [{ productId: `product${(i % 5) + 1}`, quantity: Math.floor(Math.random() * 3) + 1 }],
    totalAmount: Math.random() * 200 + 50,
    status: ["pending", "processing", "shipped", "delivered", "cancelled"][
      Math.floor(Math.random() * 5)
    ] as Order["status"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)).toISOString(), // Random date within last 30 days
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 29)).toISOString(),
  })
}

export const users: User[] = [
  {
    id: uuidv4(),
    name: "Admin User",
    email: "admin@example.com",
    password: "123", // In a real app, this would be hashed
    role: "admin",
    status: "active",
    phone: "+1234567890",
    registeredAt: new Date().toISOString(),
    defaultAddress: {
      id: uuidv4(),
      street: "123 Admin St",
      city: "Admin City",
      state: "Admin State",
      country: "Admin Country",
      zipCode: "12345",
    },
    addresses: [],
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: uuidv4(),
    name: "John Doe",
    email: "john@example.com",
    password: "userpassword", // In a real app, this would be hashed
    role: "user",
    status: "active",
    phone: "+1987654321",
    registeredAt: new Date().toISOString(),
    defaultAddress: {
      id: uuidv4(),
      street: "456 User St",
      city: "User City",
      state: "User State",
      country: "User Country",
      zipCode: "67890",
    },
    addresses: [],
    totalOrders: 5,
    totalSpent: 500.0,
  },
  // Add more mock users as needed
]

export const categories: Category[] = [
  {
    id: uuidv4(),
    name: "Perfume",
    parentId: null,
    children: [
      {
        id: uuidv4(),
        name: "Men's Perfume",
        parentId: "parentId",
        children: [],
      },
      {
        id: uuidv4(),
        name: "Women's Perfume",
        parentId: "parentId",
        children: [],
      },
    ],
  },
  // Add more categories as needed
]

export const attributes: Attribute[] = [
  {
    id: uuidv4(),
    name: "Brand",
    type: "select",
    values: ["Chanel", "Dior", "Gucci"],
  },
  {
    id: uuidv4(),
    name: "Scent Type",
    type: "select",
    values: ["Floral", "Woody", "Fresh", "Oriental"],
  },
  // Add more attributes as needed
]

export const brands: Brand[] = [
  {
    id: uuidv4(),
    name: "Chanel",
    description: "Luxury French fashion house",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: uuidv4(),
    name: "Dior",
    description: "French luxury goods company",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: uuidv4(),
    name: "Gucci",
    description: "Italian luxury fashion brand",
    logo: "/placeholder.svg?height=100&width=100",
  },
]

// Simulated API functions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchProducts(): Promise<Product[]> {
  await delay(1000) // Simulate network delay
  return products
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  await delay(1000)
  return products.find((p) => p.id === id)
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  await delay(1000)
  const newProduct = { ...product, id: uuidv4() }
  products.push(newProduct)
  return newProduct
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await delay(1000)
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) throw new Error("Product not found")
  products[index] = { ...products[index], ...updates }
  return products[index]
}

export async function deleteProduct(id: string): Promise<void> {
  await delay(1000)
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) throw new Error("Product not found")
  products.splice(index, 1)
}

export async function fetchOrders(): Promise<Order[]> {
  await delay(1000)
  return orders
}

export async function fetchOrder(id: string): Promise<Order | undefined> {
  await delay(1000)
  return orders.find((o) => o.id === id)
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  await delay(1000)
  const order = orders.find((o) => o.id === id)
  if (!order) throw new Error("Order not found")
  order.status = status
  order.updatedAt = new Date().toISOString()
  return order
}

export async function fetchUsers(): Promise<Omit<User, "password">[]> {
  await delay(1000)
  return users.map(({ password, ...user }) => user)
}

export async function fetchUser(id: string): Promise<Omit<User, "password"> | null> {
  await delay(1000)
  const user = users.find((u) => u.id === id)
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "password">>,
): Promise<Omit<User, "password"> | null> {
  await delay(1000)
  const user = users.find((u) => u.id === id)
  if (user) {
    Object.assign(user, updates)
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export async function deleteUser(id: string): Promise<void> {
  await delay(1000)
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) throw new Error("User not found")
  users.splice(index, 1)
}

export async function changeUserPassword(id: string, newPassword: string): Promise<void> {
  await delay(1000)
  const user = users.find((u) => u.id === id)
  if (!user) throw new Error("User not found")
  user.password = newPassword // In a real app, this would be hashed
}

export async function fetchCategories(): Promise<Category[]> {
  await delay(1000)
  return categories
}

export async function createCategory(category: Omit<Category, "id">): Promise<Category> {
  await delay(1000)
  const newCategory = { ...category, id: uuidv4() }
  categories.push(newCategory)
  return newCategory
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  await delay(1000)
  const category = categories.find((c) => c.id === id)
  if (!category) throw new Error("Category not found")
  Object.assign(category, updates)
  return category
}

export async function deleteCategory(id: string): Promise<void> {
  await delay(1000)
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Category not found")
  categories.splice(index, 1)
}

export async function fetchAttributes(): Promise<Attribute[]> {
  await delay(1000)
  return attributes
}

export async function createAttribute(attribute: Omit<Attribute, "id">): Promise<Attribute> {
  await delay(1000)
  const newAttribute = { ...attribute, id: uuidv4() }
  attributes.push(newAttribute)
  return newAttribute
}

export async function updateAttribute(id: string, updates: Partial<Attribute>): Promise<Attribute> {
  await delay(1000)
  const attribute = attributes.find((a) => a.id === id)
  if (!attribute) throw new Error("Attribute not found")
  Object.assign(attribute, updates)
  return attribute
}

export async function deleteAttribute(id: string): Promise<void> {
  await delay(1000)
  const index = attributes.findIndex((a) => a.id === id)
  if (index === -1) throw new Error("Attribute not found")
  attributes.splice(index, 1)
}

export async function login(email: string, password: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  const user = users.find((u) => u.email === email && u.password === password)
  return user || null
}

export async function register(name: string, email: string, password: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    password, // In a real app, this would be hashed
    role: "user",
    status: "active",
    phone: "",
    registeredAt: new Date().toISOString(),
    defaultAddress: {
      id: uuidv4(),
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    addresses: [],
    totalOrders: 0,
    totalSpent: 0,
  }
  users.push(newUser)
  return newUser
}

export async function resetPassword(email: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  const user = users.find((u) => u.email === email)
  if (user) {
    // In a real app, this would send an email with a reset link
    console.log(`Password reset requested for ${email}`)
    return true
  }
  return false
}

export async function changeUserRole(userId: string, newRole: "admin" | "user"): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.role = newRole
    return user
  }
  return null
}

export const settings = {
  general: {
    siteName: "My E-commerce Store",
    siteUrl: "https://mystore.com",
    adminEmail: "admin@mystore.com",
  },
  emailTemplates: {
    welcome: "Welcome to our store, {{name}}!",
    orderConfirmation: "Your order #{{orderId}} has been confirmed.",
    passwordReset: "Click here to reset your password: {{resetLink}}",
  },
}

export async function fetchSettings(): Promise<typeof settings> {
  await delay(1000)
  return settings
}

export async function updateSettings(updates: Partial<typeof settings>): Promise<typeof settings> {
  await delay(1000)
  Object.assign(settings, updates)
  return settings
}

export async function fetchOrdersInDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
  await delay(1000)
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    return orderDate >= startDate && orderDate <= endDate
  })
}

export async function fetchBrands(): Promise<Brand[]> {
  await delay(1000)
  return brands
}

export async function fetchBrand(id: string): Promise<Brand | undefined> {
  await delay(1000)
  return brands.find((b) => b.id === id)
}

export async function createBrand(brand: Omit<Brand, "id">): Promise<Brand> {
  await delay(1000)
  const newBrand = { ...brand, id: uuidv4() }
  brands.push(newBrand)
  return newBrand
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
  await delay(1000)
  const index = brands.findIndex((b) => b.id === id)
  if (index === -1) throw new Error("Brand not found")
  brands[index] = { ...brands[index], ...updates }
  return brands[index]
}

export async function deleteBrand(id: string): Promise<void> {
  await delay(1000)
  const index = brands.findIndex((b) => b.id === id)
  if (index === -1) throw new Error("Brand not found")
  brands.splice(index, 1)
}


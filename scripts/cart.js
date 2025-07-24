// Cart Management
class CartManager {
  constructor() {
    this.items = this.loadCart()
    this.init()
  }

  init() {
    this.updateCartUI()
    this.bindEvents()
  }

  bindEvents() {
    // Close cart when clicking overlay
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("overlay") &&
        document.getElementById("cartSidebar").classList.contains("active")
      ) {
        this.toggleCart()
      }
    })
  }

  loadCart() {
    return window.getFromStorage("cart") || []
  }

  saveCart() {
    window.saveToStorage("cart", this.items)
  }

  addItem(productId, quantity = 1, size = null, color = null) {
    const products = window.products
    const product = products.find((p) => p.id === productId)
    if (!product) return

    // Check if item already exists with same attributes
    const existingItemIndex = this.items.findIndex(
      (item) => item.id === productId && item.size === size && item.color === color,
    )

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      this.items[existingItemIndex].quantity += quantity
      window.showToast("Cart Updated", `${product.name} quantity updated in your cart.`)
    } else {
      // Add new item
      const cartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: size || (product.sizes ? product.sizes[0] : null),
        color: color || (product.colors ? product.colors[0] : null),
        dateAdded: new Date().toISOString(),
      }

      this.items.push(cartItem)
      window.showToast("Added to Cart", `${product.name} added to your cart.`)
    }

    this.saveCart()
    this.updateCartUI()
    this.animateCartButton()
  }

  removeItem(itemId) {
    const itemIndex = this.items.findIndex((item) => item.id === itemId)
    if (itemIndex > -1) {
      const item = this.items[itemIndex]
      this.items.splice(itemIndex, 1)
      this.saveCart()
      this.updateCartUI()
      window.showToast("Removed from Cart", `${item.name} removed from your cart.`)
    }
  }

  updateQuantity(itemId, newQuantity) {
    const item = this.items.find((item) => item.id === itemId)
    if (item && newQuantity > 0) {
      item.quantity = newQuantity
      this.saveCart()
      this.updateCartUI()
    }
  }

  clearCart() {
    this.items = []
    this.saveCart()
    this.updateCartUI()
    window.showToast("Cart Cleared", "All items have been removed from your cart.")
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  updateCartUI() {
    const cartCount = document.querySelector(".cart-count")
    const cartItemsCount = document.querySelector(".cart-items-count")
    const cartItems = document.getElementById("cartItems")
    const cartFooter = document.getElementById("cartFooter")
    const cartSubtotal = document.querySelector(".cart-subtotal")
    const cartTotal = document.querySelector(".cart-total")

    const itemCount = this.getItemCount()
    const subtotal = this.getSubtotal()

    // Update counts
    window.updateBadgeCount(cartCount, itemCount)
    if (cartItemsCount) {
      cartItemsCount.textContent = itemCount
    }

    // Update cart content
    if (this.items.length === 0) {
      cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <button class="btn btn-primary" onclick="cartManager.toggleCart()">Continue Shopping</button>
                </div>
            `
      cartFooter.style.display = "none"
    } else {
      cartItems.innerHTML = this.items.map((item) => this.generateCartItemHTML(item)).join("")
      cartFooter.style.display = "block"

      // Update totals
      if (cartSubtotal) cartSubtotal.textContent = window.formatPrice(subtotal)
      if (cartTotal) cartTotal.textContent = window.formatPrice(subtotal)
    }
  }

  generateCartItemHTML(item) {
    return `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-content">
                    <div class="item-title">${item.name}</div>
                    <div class="item-details">
                        ${item.size ? `Size: ${item.size}` : ""}
                        ${item.size && item.color ? " • " : ""}
                        ${item.color ? `Color: ${item.color}` : ""}
                    </div>
                    <div class="item-price">${window.formatPrice(item.price)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="item-remove" onclick="cartManager.removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `
  }

  toggleCart() {
    const cartSidebar = document.getElementById("cartSidebar")
    const overlay = document.getElementById("overlay")

    cartSidebar.classList.toggle("active")
    overlay.classList.toggle("active")

    if (cartSidebar.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  animateCartButton() {
    const cartBtn = document.querySelector(".cart-btn")
    cartBtn.classList.add("animate")
    setTimeout(() => {
      cartBtn.classList.remove("animate")
    }, 600)
  }
}

// Global cart functions
function addToCart(productId, quantity = 1, size = null, color = null) {
  window.cartManager.addItem(productId, quantity, size, color)
}

function toggleCart() {
  window.cartManager.toggleCart()
}

function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    window.cartManager.clearCart()
  }
}

// Initialize cart manager
let cartManager
document.addEventListener("DOMContentLoaded", () => {
  window.cartManager = new CartManager()
})

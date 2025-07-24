// Wishlist Management
class WishlistManager {
  constructor() {
    this.items = this.loadWishlist()
    this.init()
  }

  init() {
    this.updateWishlistUI()
    this.bindEvents()
  }

  bindEvents() {
    // Close wishlist when clicking overlay
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("overlay") &&
        document.getElementById("wishlistSidebar").classList.contains("active")
      ) {
        this.toggleWishlist()
      }
    })
  }

  loadWishlist() {
    return window.getFromStorage("wishlist") || []
  }

  saveWishlist() {
    window.saveToStorage("wishlist", this.items)
  }

  addItem(productId) {
    const products = window.products // Declare products variable
    const product = products.find((p) => p.id === productId)
    if (!product) return

    // Check if item already exists
    const existingItem = this.items.find((item) => item.id === productId)
    if (existingItem) {
      window.showToast("Already in Wishlist", `${product.name} is already in your wishlist.`, "info") // Declare showToast variable
      return
    }

    const wishlistItem = {
      id: productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      dateAdded: new Date().toISOString(),
    }

    this.items.push(wishlistItem)
    this.saveWishlist()
    this.updateWishlistUI()
    this.updateWishlistButtons()
    this.animateWishlistButton(productId)

    window.showToast("Added to Wishlist ❤️", `${product.name} has been added to your wishlist.`) // Declare showToast variable
  }

  removeItem(productId) {
    const itemIndex = this.items.findIndex((item) => item.id === productId)
    if (itemIndex > -1) {
      const item = this.items[itemIndex]
      this.items.splice(itemIndex, 1)
      this.saveWishlist()
      this.updateWishlistUI()
      this.updateWishlistButtons()
      window.showToast("Removed from Wishlist", `${item.name} has been removed from your wishlist.`) // Declare showToast variable
    }
  }

  isInWishlist(productId) {
    return this.items.some((item) => item.id === productId)
  }

  toggleItem(productId) {
    if (this.isInWishlist(productId)) {
      this.removeItem(productId)
    } else {
      this.addItem(productId)
    }
  }

  clearWishlist() {
    this.items = []
    this.saveWishlist()
    this.updateWishlistUI()
    this.updateWishlistButtons()
    window.showToast("Wishlist Cleared", "All items have been removed from your wishlist.") // Declare showToast variable
  }

  addAllToCart() {
    const cartManager = window.cartManager // Declare cartManager variable
    if (this.items.length === 0) return

    this.items.forEach((item) => {
      cartManager.addItem(item.id, 1)
    })

    window.showToast("Added to Cart", `${this.items.length} items added to your cart from wishlist.`) // Declare showToast variable
  }

  updateWishlistUI() {
    const wishlistCount = document.querySelector(".wishlist-count")
    const wishlistItemsCount = document.querySelector(".wishlist-items-count")
    const wishlistItems = document.getElementById("wishlistItems")
    const wishlistFooter = document.getElementById("wishlistFooter")

    const itemCount = this.items.length

    // Update counts
    window.updateBadgeCount(wishlistCount, itemCount) // Declare updateBadgeCount variable
    if (wishlistItemsCount) {
      wishlistItemsCount.textContent = itemCount
    }

    // Update wishlist content
    if (this.items.length === 0) {
      wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>Your wishlist is empty</h3>
                    <p>Start adding items you love by clicking the heart icon.</p>
                    <button class="btn btn-primary" onclick="wishlistManager.toggleWishlist()">Continue Shopping</button>
                </div>
            `
      wishlistFooter.style.display = "none"
    } else {
      wishlistItems.innerHTML = this.items.map((item) => this.generateWishlistItemHTML(item)).join("")
      wishlistFooter.style.display = "block"
    }
  }

  generateWishlistItemHTML(item) {
    const capitalize = window.capitalize // Declare capitalize variable
    const formatPrice = window.formatPrice // Declare formatPrice variable
    const formatDate = window.formatDate // Declare formatDate variable

    const discountPercentage = item.originalPrice
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0

    return `
            <div class="wishlist-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-content">
                    <div class="item-title">${item.name}</div>
                    <div class="item-details">
                        Category: ${capitalize(item.category)}
                        ${discountPercentage > 0 ? ` • ${discountPercentage}% OFF` : ""}
                    </div>
                    <div class="item-price">
                        ${formatPrice(item.price)}
                        ${item.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-light); margin-left: 0.5rem;">${formatPrice(item.originalPrice)}</span>` : ""}
                    </div>
                    <div class="item-details" style="font-size: 0.75rem; color: var(--text-light);">
                        Added ${formatDate(item.dateAdded)}
                    </div>
                    <button class="btn btn-primary btn-small" onclick="addToCart(${item.id})" style="margin-top: 0.5rem;">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
                <button class="item-remove" onclick="wishlistManager.removeItem(${item.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `
  }

  updateWishlistButtons() {
    const wishlistButtons = document.querySelectorAll(".wishlist-btn")
    wishlistButtons.forEach((button) => {
      const productId = Number.parseInt(button.dataset.productId)
      const icon = button.querySelector("i")

      if (this.isInWishlist(productId)) {
        button.classList.add("active")
        icon.className = "fas fa-heart"
        button.style.color = "#ef4444"
      } else {
        button.classList.remove("active")
        icon.className = "far fa-heart"
        button.style.color = ""
      }
    })

    // Update heart icon in header
    const headerHeart = document.querySelector(".wishlist-btn i")
    if (headerHeart && this.items.length > 0) {
      headerHeart.className = "fas fa-heart"
      headerHeart.style.color = "#ef4444"
    } else if (headerHeart) {
      headerHeart.className = "fas fa-heart"
      headerHeart.style.color = ""
    }
  }

  toggleWishlist() {
    const wishlistSidebar = document.getElementById("wishlistSidebar")
    const overlay = document.getElementById("overlay")

    wishlistSidebar.classList.toggle("active")
    overlay.classList.toggle("active")

    if (wishlistSidebar.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  animateWishlistButton(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"] .wishlist-btn`)
    if (button) {
      button.classList.add("animate")
      setTimeout(() => {
        button.classList.remove("animate")
      }, 500)
    }
  }
}

// Global wishlist functions
function toggleWishlist(productId = null) {
  const wishlistManager = window.wishlistManager // Declare wishlistManager variable
  if (productId) {
    wishlistManager.toggleItem(productId)
  } else {
    wishlistManager.toggleWishlist()
  }
}

function clearWishlist() {
  const wishlistManager = window.wishlistManager // Declare wishlistManager variable
  if (confirm("Are you sure you want to clear your wishlist?")) {
    wishlistManager.clearWishlist()
  }
}

function addAllToCart() {
  const wishlistManager = window.wishlistManager // Declare wishlistManager variable
  wishlistManager.addAllToCart()
}

// Initialize wishlist manager
let wishlistManager
document.addEventListener("DOMContentLoaded", () => {
  wishlistManager = new WishlistManager()
})

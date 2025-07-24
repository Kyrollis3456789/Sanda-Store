// Sale Page Management
class SaleManager {
  constructor() {
    this.allSaleProducts = []
    this.filteredProducts = []
    this.currentPage = 1
    this.itemsPerPage = 12
    this.filters = {
      categories: [],
      discounts: [],
      maxPrice: 1000,
      special: [],
    }
    this.sortBy = "discount-high"
    this.viewMode = "grid"
    this.init()
  }

  init() {
    this.loadSaleProducts()
    this.setupFilters()
    this.bindEvents()
    this.startCountdown()
    this.renderProducts()
    this.updateUI()
  }

  loadSaleProducts() {
    // Create sale products with discounts
    this.allSaleProducts = window.products
      .filter((product) => product.originalPrice) // Only products with original prices
      .map((product) => {
        const additionalDiscount = Math.floor(Math.random() * 30) + 10 // 10-40% additional discount
        const salePrice = product.price * (1 - additionalDiscount / 100)
        const totalDiscount = ((product.originalPrice - salePrice) / product.originalPrice) * 100

        return {
          ...product,
          salePrice,
          discountPercentage: Math.round(totalDiscount),
          saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          originalStock: 100,
          saleStock: Math.floor(Math.random() * 50) + 10, // 10-60 items left
        }
      })

    this.filteredProducts = [...this.allSaleProducts]

    // Load flash sale products
    this.loadFlashSaleProducts()
  }

  loadFlashSaleProducts() {
    const flashSaleContainer = document.getElementById("flashSaleProducts")
    if (!flashSaleContainer) return

    const flashSaleProducts = this.allSaleProducts.filter((product) => product.isFlashSale).slice(0, 4)

    flashSaleContainer.innerHTML = flashSaleProducts.map((product) => this.generateSaleProductCard(product)).join("")

    // Update wishlist buttons
    setTimeout(() => {
      if (window.wishlistManager) {
        window.wishlistManager.updateWishlistButtons()
      }
    }, 100)
  }

  setupFilters() {
    this.setupPriceFilter()
  }

  setupPriceFilter() {
    const priceRange = document.getElementById("priceRange")
    const maxPriceLabel = document.getElementById("maxPrice")

    if (!priceRange || !maxPriceLabel) return

    const maxPrice = Math.max(...this.allSaleProducts.map((product) => product.salePrice))
    priceRange.max = Math.ceil(maxPrice)
    priceRange.value = Math.ceil(maxPrice)
    maxPriceLabel.textContent = `$${Math.ceil(maxPrice)}`

    priceRange.addEventListener("input", (e) => {
      maxPriceLabel.textContent = `$${e.target.value}`
      this.filters.maxPrice = Number.parseFloat(e.target.value)
      this.applyFilters()
    })
  }

  bindEvents() {
    // Sort change
    const sortSelect = document.getElementById("sortSelect")
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value
        this.sortProducts()
      })
    }

    // View mode change
    const viewBtns = document.querySelectorAll(".view-btn")
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const view = e.currentTarget.dataset.view
        this.changeView(view)
      })
    })
  }

  filterByCategory() {
    const checkedCategories = Array.from(
      document.querySelectorAll('.filter-group input[type="checkbox"][value]:checked'),
    )
      .filter((input) => ["socks", "shoes", "salwar"].includes(input.value))
      .map((input) => input.value)
    this.filters.categories = checkedCategories
    this.applyFilters()
  }

  filterByDiscount() {
    const checkedDiscounts = Array.from(
      document.querySelectorAll('.filter-group input[type="checkbox"][value]:checked'),
    )
      .filter((input) => ["50", "30", "20"].includes(input.value))
      .map((input) => Number.parseInt(input.value))
    this.filters.discounts = checkedDiscounts
    this.applyFilters()
  }

  filterBySpecial() {
    const checkedSpecial = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"][value]:checked'))
      .filter((input) => ["flash", "limited"].includes(input.value))
      .map((input) => input.value)
    this.filters.special = checkedSpecial
    this.applyFilters()
  }

  applyFilters() {
    this.filteredProducts = this.allSaleProducts.filter((product) => {
      // Category filter
      if (this.filters.categories.length > 0) {
        if (!this.filters.categories.includes(product.category)) {
          return false
        }
      }

      // Discount filter
      if (this.filters.discounts.length > 0) {
        if (!this.filters.discounts.some((discount) => product.discountPercentage >= discount)) {
          return false
        }
      }

      // Price filter
      if (product.salePrice > this.filters.maxPrice) {
        return false
      }

      // Special filter
      if (this.filters.special.length > 0) {
        if (this.filters.special.includes("flash") && !product.isFlashSale) {
          return false
        }
        if (this.filters.special.includes("limited") && product.saleStock > 20) {
          return false
        }
      }

      return true
    })

    this.currentPage = 1
    this.sortProducts()
  }

  sortProducts() {
    switch (this.sortBy) {
      case "discount-high":
        this.filteredProducts.sort((a, b) => b.discountPercentage - a.discountPercentage)
        break
      case "discount-low":
        this.filteredProducts.sort((a, b) => a.discountPercentage - b.discountPercentage)
        break
      case "price-low":
        this.filteredProducts.sort((a, b) => a.salePrice - b.salePrice)
        break
      case "price-high":
        this.filteredProducts.sort((a, b) => b.salePrice - a.salePrice)
        break
      case "rating":
        this.filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    this.renderProducts()
    this.updateUI()
  }

  renderProducts() {
    const productsGrid = document.getElementById("productsGrid")
    const noResults = document.getElementById("noResults")

    if (this.filteredProducts.length === 0) {
      productsGrid.innerHTML = ""
      noResults.style.display = "block"
      return
    }

    noResults.style.display = "none"

    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    const productsToShow = this.filteredProducts.slice(0, endIndex)

    productsGrid.innerHTML = productsToShow.map((product) => this.generateSaleProductCard(product)).join("")

    // Update load more button
    const loadMoreContainer = document.getElementById("loadMoreContainer")
    if (endIndex < this.filteredProducts.length) {
      loadMoreContainer.style.display = "block"
    } else {
      loadMoreContainer.style.display = "none"
    }

    // Update wishlist buttons
    setTimeout(() => {
      if (window.wishlistManager) {
        window.wishlistManager.updateWishlistButtons()
      }
    }, 100)
  }

  generateSaleProductCard(product) {
    const stockPercentage = ((product.saleStock || 0) / (product.originalStock || 100)) * 100
    const stockClass = stockPercentage <= 20 ? "low" : stockPercentage <= 50 ? "medium" : "high"

    return `
            <div class="product-card sale-product-card hover-card" data-product-id="${product.id}">
              <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-price">
                  <span class="original-price">$${product.originalPrice}</span>
                  <span class="sale-price">$${product.salePrice}</span>
                </div>
                <div class="product-discount">
                  <span class="discount-percentage">${product.discountPercentage}% Off</span>
                </div>
                <div class="product-stock ${stockClass}">
                  <span class="stock-remaining">${product.saleStock} Left</span>
                </div>
                <button class="add-to-wishlist">Add to Wishlist</button>
              </div>
            </div>
          `
  }

  startCountdown() {
    // Countdown logic here
  }

  changeView(view) {
    this.viewMode = view
    document.getElementById("productsGrid").className = `products-container ${view}`
  }

  updateUI() {
    // Update UI logic here
  }
}

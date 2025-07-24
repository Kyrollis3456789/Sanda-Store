// Category Page Management
class CategoryManager {
  constructor(category) {
    this.category = category
    this.allProducts = []
    this.filteredProducts = []
    this.currentPage = 1
    this.itemsPerPage = 12
    this.filters = {
      colors: [],
      sizes: [],
      maxPrice: 1000,
      minRating: 0,
      types: [],
      styles: [],
    }
    this.sortBy = "featured"
    this.viewMode = "grid"
    this.init()
  }

  init() {
    this.loadProducts()
    this.setupFilters()
    this.bindEvents()
    this.renderProducts()
    this.updateUI()
  }

  loadProducts() {
    // Filter products by category
    this.allProducts = window.products.filter((product) => product.category === this.category)
    this.filteredProducts = [...this.allProducts]

    // Update product count in hero
    const countElement = document.getElementById(`${this.category}Count`)
    if (countElement) {
      countElement.textContent = this.allProducts.length
    }
  }

  setupFilters() {
    this.setupColorFilters()
    this.setupSizeFilters()
    this.setupPriceFilter()
    this.setupRatingFilters()
    this.setupTypeFilters()
    this.setupStyleFilters()
  }

  setupColorFilters() {
    const colorFilters = document.getElementById("colorFilters")
    if (!colorFilters) return

    const allColors = [...new Set(this.allProducts.flatMap((product) => product.colors || []))]

    colorFilters.innerHTML = allColors
      .map(
        (color) => `
            <label class="filter-option">
                <input type="checkbox" value="${color}" onchange="filterByColor()">
                <span>${color}</span>
            </label>
        `,
      )
      .join("")
  }

  setupSizeFilters() {
    const sizeFilters = document.getElementById("sizeFilters")
    if (!sizeFilters) return

    const allSizes = [...new Set(this.allProducts.flatMap((product) => product.sizes || []))]

    sizeFilters.innerHTML = allSizes
      .map(
        (size) => `
            <label class="filter-option">
                <input type="checkbox" value="${size}" onchange="filterBySize()">
                <span>${size}</span>
            </label>
        `,
      )
      .join("")
  }

  setupPriceFilter() {
    const priceRange = document.getElementById("priceRange")
    const maxPriceLabel = document.getElementById("maxPrice")

    if (!priceRange || !maxPriceLabel) return

    const maxPrice = Math.max(...this.allProducts.map((product) => product.price))
    priceRange.max = Math.ceil(maxPrice)
    priceRange.value = Math.ceil(maxPrice)
    maxPriceLabel.textContent = `$${Math.ceil(maxPrice)}`

    priceRange.addEventListener("input", (e) => {
      maxPriceLabel.textContent = `$${e.target.value}`
      this.filters.maxPrice = Number.parseFloat(e.target.value)
      this.applyFilters()
    })
  }

  setupRatingFilters() {
    const ratingFilters = document.getElementById("ratingFilters")
    if (!ratingFilters) return

    const allRatings = [...new Set(this.allProducts.map((product) => product.rating))]

    ratingFilters.innerHTML = allRatings
      .map(
        (rating) => `
            <label class="filter-option">
                <input type="checkbox" value="${rating}" onchange="filterByRating()">
                <span>${rating}</span>
            </label>
        `,
      )
      .join("")
  }

  setupTypeFilters() {
    const typeFilters = document.getElementById("typeFilters")
    if (!typeFilters) return

    const allTypes = [...new Set(this.allProducts.flatMap((product) => product.type || []))]

    typeFilters.innerHTML = allTypes
      .map(
        (type) => `
            <label class="filter-option">
                <input type="checkbox" value="${type}" onchange="filterByType()">
                <span>${type}</span>
            </label>
        `,
      )
      .join("")
  }

  setupStyleFilters() {
    const styleFilters = document.getElementById("styleFilters")
    if (!styleFilters) return

    const allStyles = [...new Set(this.allProducts.flatMap((product) => product.style || []))]

    styleFilters.innerHTML = allStyles
      .map(
        (style) => `
            <label class="filter-option">
                <input type="checkbox" value="${style}" onchange="filterByStyle()">
                <span>${style}</span>
            </label>
        `,
      )
      .join("")
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

    // Search input
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.addEventListener("input", debounce(this.handleSearch.bind(this), 300))
    }
  }

  filterByColor() {
    const checkedColors = Array.from(document.querySelectorAll('#colorFilters input[type="checkbox"]:checked')).map(
      (input) => input.value,
    )
    this.filters.colors = checkedColors
    this.applyFilters()
  }

  filterBySize() {
    const checkedSizes = Array.from(document.querySelectorAll('#sizeFilters input[type="checkbox"]:checked')).map(
      (input) => input.value,
    )
    this.filters.sizes = checkedSizes
    this.applyFilters()
  }

  filterByRating() {
    const checkedRatings = Array.from(document.querySelectorAll('.rating-filters input[type="checkbox"]:checked')).map(
      (input) => Number.parseFloat(input.value),
    )
    this.filters.minRating = Math.max(...checkedRatings, 0)
    this.applyFilters()
  }

  filterByType() {
    const checkedTypes = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"][value]:checked'))
      .filter((input) => ["running", "dress", "casual", "athletic"].includes(input.value))
      .map((input) => input.value)
    this.filters.types = checkedTypes
    this.applyFilters()
  }

  filterByStyle() {
    const checkedStyles = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"][value]:checked'))
      .filter((input) => ["elegant", "traditional", "casual", "embroidered"].includes(input.value))
      .map((input) => input.value)
    this.filters.styles = checkedStyles
    this.applyFilters()
  }

  applyFilters() {
    this.filteredProducts = this.allProducts.filter((product) => {
      // Color filter
      if (this.filters.colors.length > 0) {
        if (!product.colors || !product.colors.some((color) => this.filters.colors.includes(color))) {
          return false
        }
      }

      // Size filter
      if (this.filters.sizes.length > 0) {
        if (!product.sizes || !product.sizes.some((size) => this.filters.sizes.includes(size))) {
          return false
        }
      }

      // Price filter
      if (product.price > this.filters.maxPrice) {
        return false
      }

      // Rating filter
      if (product.rating < this.filters.minRating) {
        return false
      }

      // Type filter (for shoes)
      if (this.filters.types.length > 0) {
        const productType = this.getProductType(product)
        if (!this.filters.types.includes(productType)) {
          return false
        }
      }

      // Style filter (for salwar)
      if (this.filters.styles.length > 0) {
        const productStyle = this.getProductStyle(product)
        if (!this.filters.styles.includes(productStyle)) {
          return false
        }
      }

      return true
    })

    this.currentPage = 1
    this.sortProducts()
  }

  getProductType(product) {
    const name = product.name.toLowerCase()
    if (name.includes("running") || name.includes("sneaker")) return "running"
    if (name.includes("dress") || name.includes("formal")) return "dress"
    if (name.includes("athletic") || name.includes("performance")) return "athletic"
    return "casual"
  }

  getProductStyle(product) {
    const name = product.name.toLowerCase()
    if (name.includes("elegant")) return "elegant"
    if (name.includes("traditional") || name.includes("embroidered")) return "traditional"
    if (name.includes("embroidered")) return "embroidered"
    return "casual"
  }

  sortProducts() {
    switch (this.sortBy) {
      case "price-low":
        this.filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        this.filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        this.filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        this.filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        break
      default: // featured
        // Keep original order or sort by featured flag
        this.filteredProducts.sort((a, b) => (b.featured || 0) - (a.featured || 0))
        break
    }

    this.renderProducts()
    this.updateUI()
  }

  renderProducts() {
    const productsGrid = document.getElementById("productsGrid")
    const noResults = document.getElementById("noResults")
    const loadMoreContainer = document.getElementById("loadMoreContainer")

    // Update results count
    const resultsCount = document.getElementById("resultsCount")
    if (resultsCount) {
      resultsCount.textContent = `${this.filteredProducts.length} result${this.filteredProducts.length !== 1 ? "s" : ""}`
    }

    // Show/hide no results
    if (this.filteredProducts.length === 0) {
      productsGrid.style.display = "none"
      noResults.style.display = "block"
      loadMoreContainer.style.display = "none"
      return
    } else {
      productsGrid.style.display = "grid"
      noResults.style.display = "none"
    }

    // Calculate products to show
    const productsToShow = this.filteredProducts.slice(0, this.currentPage * this.itemsPerPage)

    // Generate products HTML
    const productsHTML = productsToShow.map((product) => this.generateProductCard(product)).join("")

    productsGrid.innerHTML = productsHTML

    // Show/hide load more button
    if (productsToShow.length < this.filteredProducts.length) {
      loadMoreContainer.style.display = "block"
    } else {
      loadMoreContainer.style.display = "none"
    }

    // Apply animations
    this.animateProductCards()
  }

  generateProductCard(product) {
    const discountPercentage = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

    return `
            <div class="product-card hover-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                    ${product.sale ? `<div class="sale-badge">-${product.salePercentage}%</div>` : ""}
                </div>
                <div class="product-content">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        ${window.generateStarRating(product.rating, product.reviews)}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        ${
                          product.sale
                            ? `<span class="original-price">$${product.originalPrice}</span>
                             <span class="sale-price">$${product.price}</span>`
                            : `<span class="current-price">$${product.price}</span>`
                        }
                    </div>
                    <div class="product-actions">
                        <button class="wishlist-btn ${window.isInWishlist(product.id) ? "active" : ""}" 
                                onclick="window.toggleWishlistItem(${product.id})" 
                                title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        <div class="product-colors">
                            ${
                              product.colors
                                ? product.colors
                                    .slice(0, 3)
                                    .map(
                                      (color) =>
                                        `<span class="color-dot" style="background-color: ${color}" title="${color}"></span>`,
                                    )
                                    .join("")
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        `
  }

  changeView(view) {
    this.viewMode = view
    const productsGrid = document.getElementById("productsGrid")
    const viewBtns = document.querySelectorAll(".view-btn")

    // Update active button
    viewBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view)
    })

    // Update grid class
    if (view === "list") {
      productsGrid.classList.add("list-view")
    } else {
      productsGrid.classList.remove("list-view")
    }
  }

  loadMoreProducts() {
    this.currentPage++
    this.renderProducts()
  }

  clearAllFilters() {
    // Reset all filter inputs
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach((input) => {
      input.checked = false
    })

    const priceRange = document.getElementById("priceRange")
    const maxPriceLabel = document.getElementById("maxPrice")
    if (priceRange && maxPriceLabel) {
      const maxPrice = Math.max(...this.allProducts.map((product) => product.price))
      priceRange.value = Math.ceil(maxPrice)
      maxPriceLabel.textContent = `$${Math.ceil(maxPrice)}`
    }

    // Reset filters object
    this.filters = {
      colors: [],
      sizes: [],
      maxPrice: 1000,
      minRating: 0,
      types: [],
      styles: [],
    }

    this.applyFilters()
    window.showToast("Filters cleared", "success")
  }

  updateUI() {
    // Update cart and wishlist counts
    window.updateCartCount()
    window.updateWishlistCount()

    // Update navigation active state
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      const href = link.getAttribute("href")
      if (href && href.includes(this.category)) {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })
  }

  animateProductCards() {
    const cards = document.querySelectorAll(".product-card")
    cards.forEach((card, index) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"

      setTimeout(() => {
        card.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, index * 50)
    })
  }

  handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase()

    if (query.length === 0) {
      document.getElementById("searchResults").innerHTML = `
          <div class="search-placeholder">
              <p>Start typing to search for ${this.category}</p>
          </div>
      `
      return
    }

    const searchResults = this.allProducts.filter(
      (product) =>
        product.category.toLowerCase() === this.category.toLowerCase() &&
        (product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)),
    )

    this.displaySearchResults(searchResults)
  }

  displaySearchResults(results) {
    const searchResultsContainer = document.getElementById("searchResults")

    if (results.length === 0) {
      searchResultsContainer.innerHTML = `
          <div class="no-search-results">
              <p>No results found for "${document.getElementById("searchInput").value}"</p>
          </div>
      `
      return
    }

    const resultsHTML = results
      .map(
        (product) => `
        <div class="search-result-item" onclick="window.selectProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="search-result-image">
            <div class="search-result-content">
                <h4>${product.name}</h4>
                <p class="search-result-price">$${product.price}</p>
                <div class="search-result-rating">
                    ${window.generateStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
            </div>
        </div>
    `,
      )
      .join("")

    searchResultsContainer.innerHTML = resultsHTML
  }
}

// Global functions for category pages
function initCategoryPage(category) {
  window.categoryManager = new CategoryManager(category)
}

function filterByColor() {
  if (window.categoryManager) {
    window.categoryManager.filterByColor()
  }
}

function filterBySize() {
  if (window.categoryManager) {
    window.categoryManager.filterBySize()
  }
}

function filterByRating() {
  if (window.categoryManager) {
    window.categoryManager.filterByRating()
  }
}

function filterByType() {
  if (window.categoryManager) {
    window.categoryManager.filterByType()
  }
}

function filterByStyle() {
  if (window.categoryManager) {
    window.categoryManager.filterByStyle()
  }
}

function sortProducts() {
  if (window.categoryManager) {
    window.categoryManager.sortProducts()
  }
}

function changeView(view) {
  if (window.categoryManager) {
    window.categoryManager.changeView(view)
  }
}

function loadMoreProducts() {
  if (window.categoryManager) {
    window.categoryManager.loadMoreProducts()
  }
}

function clearAllFilters() {
  if (window.categoryManager) {
    window.categoryManager.clearAllFilters()
  }
}

// Debounce function for search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Select product from search
function selectProduct(productId) {
  // Close search modal
  window.toggleSearch()

  // Scroll to product or navigate to product page
  const productCard = document.querySelector(`[data-product-id="${productId}"]`)
  if (productCard) {
    productCard.scrollIntoView({ behavior: "smooth", block: "center" })
    productCard.classList.add("highlight")
    setTimeout(() => {
      productCard.classList.remove("highlight")
    }, 2000)
  }
}

// Generate stars HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  let starsHTML = ""

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }

  // Half star
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

// Add highlight effect for product cards
const style = document.createElement("style")
style.textContent = `
    .product-card.highlight {
        animation: highlight 2s ease-in-out;
    }
    
    @keyframes highlight {
        0%, 100% { transform: scale(1); box-shadow: var(--shadow-sm); }
        50% { transform: scale(1.02); box-shadow: var(--shadow-lg); }
    }
`
document.head.appendChild(style)

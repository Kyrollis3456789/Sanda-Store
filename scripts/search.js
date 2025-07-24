// Search Management
class SearchManager {
  constructor() {
    this.searchInput = document.getElementById("searchInput")
    this.searchResults = document.getElementById("searchResults")
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        debounce((e) => {
          this.performSearch(e.target.value)
        }, 300),
      )

      this.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          this.performSearch(e.target.value)
        }
      })
    }

    // Close search when clicking overlay
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("overlay") &&
        document.getElementById("searchModal").classList.contains("active")
      ) {
        this.toggleSearch()
      }
    })
  }

  performSearch(query) {
    if (!query || query.trim().length < 2) {
      this.showPlaceholder()
      return
    }

    const results = this.searchProducts(query.trim())
    this.displayResults(results, query)
  }

  searchProducts(query) {
    const lowercaseQuery = query.toLowerCase()

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        (product.colors && product.colors.some((color) => color.toLowerCase().includes(lowercaseQuery))) ||
        (product.features && product.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)))
      )
    })
  }

  displayResults(results, query) {
    if (results.length === 0) {
      this.searchResults.innerHTML = `
                <div class="search-placeholder">
                    <p>No products found for "${query}"</p>
                    <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
                        Try different keywords or browse our categories
                    </p>
                </div>
            `
      return
    }

    this.searchResults.innerHTML = `
            <div style="padding: 1rem 0; border-bottom: 1px solid var(--border-light); margin-bottom: 1rem;">
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">
                    ${results.length} result${results.length === 1 ? "" : "s"} found for "${query}"
                </p>
            </div>
            ${results.map((product) => this.generateSearchResultHTML(product)).join("")}
        `
  }

  generateSearchResultHTML(product) {
    const discountPercentage = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

    return `
            <div class="search-result" onclick="this.selectProduct(${product.id})">
                <img src="${product.image}" alt="${product.name}" class="search-result-image">
                <div class="search-result-content">
                    <div class="search-result-title">${product.name}</div>
                    <div class="search-result-category">${capitalize(product.category)}</div>
                    <div class="search-result-price">
                        ${formatPrice(product.price)}
                        ${discountPercentage > 0 ? `<span style="color: var(--error-color); font-size: 0.75rem; margin-left: 0.5rem;">${discountPercentage}% OFF</span>` : ""}
                    </div>
                </div>
            </div>
        `
  }

  selectProduct(productId) {
    // In a real app, this would navigate to the product page
    this.toggleSearch()
    showToast("Product Selected", `Product ${productId} selected`, "info")

    // Scroll to the product if it's visible on the page
    const productCard = document.querySelector(`[data-product-id="${productId}"]`)
    if (productCard) {
      productCard.scrollIntoView({ behavior: "smooth", block: "center" })
      productCard.style.outline = "2px solid var(--primary-color)"
      setTimeout(() => {
        productCard.style.outline = ""
      }, 2000)
    }
  }

  showPlaceholder() {
    this.searchResults.innerHTML = `
            <div class="search-placeholder">
                <p>Start typing to search for products</p>
            </div>
        `
  }

  toggleSearch() {
    const searchModal = document.getElementById("searchModal")
    const overlay = document.getElementById("overlay")

    searchModal.classList.toggle("active")
    overlay.classList.toggle("active")

    if (searchModal.classList.contains("active")) {
      document.body.style.overflow = "hidden"
      setTimeout(() => {
        this.searchInput.focus()
      }, 100)
    } else {
      document.body.style.overflow = ""
      this.clearSearch()
    }
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = ""
    }
    this.showPlaceholder()
  }
}

// Global search functions
function toggleSearch() {
  searchManager.toggleSearch()
}

function clearSearch() {
  searchManager.clearSearch()
}

// Initialize search manager
let searchManager
document.addEventListener("DOMContentLoaded", () => {
  searchManager = new SearchManager()
})

// Declare variables before using them
const debounce = (func, wait) => {
  let timeout
  return function (...args) {
    
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const products = [
  {
    id: 1,
    name: "Product 1",
    description: "Description 1",
    category: "Category 1",
    price: 100,
    originalPrice: 150,
    colors: ["Red", "Blue"],
    features: ["Feature 1"],
  },
  {
    id: 2,
    name: "Product 2",
    description: "Description 2",
    category: "Category 2",
    price: 200,
    originalPrice: 250,
    colors: ["Green", "Yellow"],
    features: ["Feature 2"],
  },
]

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}

const showToast = (title, message, type) => {
  console.log(`${type}: ${title} - ${message}`)
}

// Utility Functions

// Format price to currency
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

// Generate star rating HTML
function generateStarRating(rating, reviews) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let starsHTML = ""

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star star"></i>'
  }

  // Half star
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt star"></i>'
  }

  // Empty stars
  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star star empty"></i>'
  }

  return `
        <div class="product-rating">
            ${starsHTML}
            <span class="rating-text">${rating} (${reviews})</span>
        </div>
    `
}

// Generate product card HTML
function generateProductCard(product) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return `
        <div class="product-card hover-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${discountPercentage > 0 ? `<div class="product-badge">${discountPercentage}% OFF</div>` : ""}
                ${product.isFlashSale ? '<div class="product-badge" style="top: 0.75rem; right: 0.75rem; background: #f59e0b;">⚡ FLASH</div>' : ""}
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                ${generateStarRating(product.rating, product.reviews)}
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ""}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `
}

// Show toast notification
function showToast(title, message, type = "success") {
  const toastContainer = document.getElementById("toastContainer")
  const toastId = "toast-" + Date.now()

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  const toast = document.createElement("div")
  toast.id = toastId
  toast.className = `toast ${type}`
  toast.innerHTML = `
        <i class="${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="closeToast('${toastId}')">
            <i class="fas fa-times"></i>
        </button>
    `

  toastContainer.appendChild(toast)

  // Show toast
  setTimeout(() => {
    toast.classList.add("show")
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    closeToast(toastId)
  }, 5000)
}

// Close toast notification
function closeToast(toastId) {
  const toast = document.getElementById(toastId)
  if (toast) {
    toast.classList.remove("show")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }
}

// Local storage helpers
function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return null
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
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

// Animate elements when they come into view
function animateOnScroll() {
  const elements = document.querySelectorAll(".fade-in, .slide-up, .slide-left, .slide-right")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  elements.forEach((element) => {
    observer.observe(element)
  })
}

// Initialize stagger animations
function initStaggerAnimations() {
  const staggerContainers = document.querySelectorAll(".stagger-container")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  staggerContainers.forEach((container) => {
    observer.observe(container)
  })
}

// Smooth scroll to element
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Update badge count with animation
function updateBadgeCount(badgeElement, count) {
  if (count > 0) {
    badgeElement.textContent = count
    badgeElement.classList.add("show", "animate")
    setTimeout(() => {
      badgeElement.classList.remove("animate")
    }, 300)
  } else {
    badgeElement.classList.remove("show")
  }
}

// Format date for wishlist
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Generate random ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

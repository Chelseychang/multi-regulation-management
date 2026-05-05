// Application Entry Point
class App {
  constructor() {
    this.router = null;
    this.dataService = null;
  }

  async init() {
    console.log('🚀 Initializing Regulation Management System...');

    // Initialize DataService
    this.dataService = new DataService();

    // Load master data (countries, nationalities)
    try {
      await this.dataService.loadMasterData();
      console.log('✅ Master data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load master data:', error);
      this.showToast('Failed to load master data', 'error');
    }

    // Initialize Router
    this.router = new Router();
    this.router.init();

    // Initialize Navigation
    this.initNavigation();

    // Initialize Mobile Menu
    this.initMobileMenu();

    // Bind Global Events
    this.bindGlobalEvents();

    console.log('✅ Application initialized successfully');
  }

  initNavigation() {
    // Handle menu click events
    $('.nav-link, .submenu-link').on('click', (e) => {
      const href = $(e.currentTarget).attr('href');

      // Only handle hash links
      if (href && href.startsWith('#')) {
        e.preventDefault();
        this.router.navigate(href);

        // Close mobile menu if open
        if (window.innerWidth < 992) {
          this.closeMobileMenu();
        }
      }
    });

    // Handle submenu toggle
    $('.has-submenu > .nav-link').on('click', function(e) {
      if (!$(this).attr('href').startsWith('#/')) {
        e.preventDefault();
      }
      $(this).parent().toggleClass('open');
    });
  }

  initMobileMenu() {
    const $toggle = $('#mobileMenuToggle');
    const $sidebar = $('#sidebar');
    const $overlay = $('#sidebarOverlay');

    $toggle.on('click', () => {
      $sidebar.toggleClass('mobile-open');
      $overlay.toggleClass('active');
    });

    $overlay.on('click', () => {
      this.closeMobileMenu();
    });
  }

  closeMobileMenu() {
    $('#sidebar').removeClass('mobile-open');
    $('#sidebarOverlay').removeClass('active');
  }

  bindGlobalEvents() {
    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });

    // Close mobile menu on window resize
    $(window).on('resize', () => {
      if (window.innerWidth >= 992) {
        this.closeMobileMenu();
      }
    });
  }

  // Toast notification utility
  showToast(message, type = 'info', title = '') {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };

    const toastTitle = title || titles[type];
    const toastIcon = icons[type] || icons.info;

    const $toast = $(`
      <div class="toast toast-${type}">
        <div class="toast-icon">
          <i class="fas ${toastIcon}"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">${toastTitle}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `);

    $('#toastContainer').append($toast);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      $toast.fadeOut(300, function() {
        $(this).remove();
      });
    }, 5000);

    // Manual close
    $toast.find('.toast-close').on('click', function() {
      $toast.fadeOut(300, function() {
        $(this).remove();
      });
    });
  }
}

// Global toast function
window.showToast = function(message, type = 'info', title = '') {
  if (window.appInstance) {
    window.appInstance.showToast(message, type, title);
  }
};

// Initialize application when DOM is ready
$(document).ready(() => {
  window.appInstance = new App();
  window.appInstance.init();
});

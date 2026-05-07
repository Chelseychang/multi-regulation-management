// Client-side Router
class Router {
  constructor() {
    this.routes = {
      '#/regulation/list': 'pages/regulation-list-new.html',
      '#/regulation/create': 'pages/regulation-list-new.html',
      '#/regulation/edit/:id': 'pages/regulation-list-new.html',
      '#/regulation/onboarding': 'pages/onboarding-flow.html'
    };
    this.currentRoute = null;
    this.currentParams = {};
  }

  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());

    // Handle initial route
    this.handleRouteChange();
  }

  async handleRouteChange() {
    const hash = window.location.hash || '#/regulation/list';
    console.log('📍 Navigating to:', hash);

    // Update active navigation
    this.updateActiveNav(hash);

    // Update breadcrumb
    this.updateBreadcrumb(hash);

    // Load page content
    await this.loadPage(hash);
  }

  updateActiveNav(hash) {
    // Remove active class from all links
    $('.nav-link, .submenu-link').removeClass('active');

    // Remove open class from all submenus
    $('.has-submenu').removeClass('open');

    // Add active class to matching submenu link
    const $matchingSubmenuLink = $(`.submenu-link[href="${hash}"]`);
    if ($matchingSubmenuLink.length > 0) {
      $matchingSubmenuLink.addClass('active');
      // Expand parent menu
      $matchingSubmenuLink.closest('.has-submenu').addClass('open');
    } else {
      // If not a submenu link, try to match nav-link
      $(`.nav-link[href="${hash}"]`).addClass('active');
    }
  }

  updateBreadcrumb(hash) {
    const $breadcrumb = $('#breadcrumb');
    $breadcrumb.empty();

    // Always start with Home
    $breadcrumb.append('<li class="breadcrumb-item">Home</li>');

    // Parse route and add breadcrumb items
    if (hash === '#/regulation/list' || hash.startsWith('#/regulation')) {
      $breadcrumb.append('<li class="breadcrumb-item">Regulation Management</li>');

      if (hash === '#/regulation/create') {
        $breadcrumb.append('<li class="breadcrumb-item active">Create Regulation</li>');
      } else if (hash.startsWith('#/regulation/edit/')) {
        $breadcrumb.append('<li class="breadcrumb-item active">Edit Regulation</li>');
      } else {
        $breadcrumb.append('<li class="breadcrumb-item active">Regulation List</li>');
      }
    } else {
      $breadcrumb.append('<li class="breadcrumb-item active">Dashboard</li>');
    }
  }

  async loadPage(hash) {
    const route = this.matchRoute(hash);
    const $content = $('#main-content');

    if (!route) {
      console.warn('⚠️ No matching route for:', hash);
      $content.html(`
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fas fa-map-signs"></i></div>
          <div class="empty-state-title">Page Not Found</div>
          <div class="empty-state-description">
            The page you're looking for doesn't exist.
          </div>
          <button class="btn btn-primary mt-3" onclick="window.location.hash='#/regulation/list'">
            Go to Regulation List
          </button>
        </div>
      `);
      return;
    }

    // Trigger page unload event to cleanup previous page
    $(document).trigger('pageUnload', {
      route: this.currentRoute
    });

    // Show loading spinner
    $content.html(`
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `);

    try {
      // Load page HTML with cache-busting timestamp
      const timestamp = new Date().getTime();
      const html = await $.get(`${route.template}?v=${timestamp}`);
      $content.html(html);

      // Store current route and params
      this.currentRoute = hash;
      this.currentParams = route.params;

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 50));

      // Trigger page loaded event
      $(document).trigger('pageLoaded', {
        route: hash,
        params: route.params,
        template: route.template
      });

      console.log('✅ Page loaded successfully:', hash);

    } catch (error) {
      console.error('❌ Failed to load page:', error);
      $content.html(`
        <div class="alert alert-danger">
          <h4><i class="fas fa-exclamation-triangle"></i> Error Loading Page</h4>
          <p>Failed to load the page content. Please try again.</p>
          <button class="btn btn-outline-danger btn-sm" onclick="location.reload()">
            <i class="fas fa-redo"></i> Reload Page
          </button>
        </div>
      `);
    }
  }

  matchRoute(hash) {
    // Exact match
    if (this.routes[hash]) {
      return { template: this.routes[hash], params: {} };
    }

    // Parameter match (e.g., #/regulation/edit/:id)
    for (const [pattern, template] of Object.entries(this.routes)) {
      const regex = this.patternToRegex(pattern);
      const match = hash.match(regex);

      if (match) {
        const paramNames = this.extractParamNames(pattern);
        const params = {};

        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });

        return { template, params };
      }
    }

    return null;
  }

  patternToRegex(pattern) {
    // Convert pattern like '#/regulation/edit/:id' to regex
    const regexPattern = pattern
      .replace(/\//g, '\\/')
      .replace(/:\w+/g, '([^/]+)');
    return new RegExp('^' + regexPattern + '$');
  }

  extractParamNames(pattern) {
    // Extract parameter names from pattern like '#/regulation/edit/:id'
    const matches = pattern.match(/:\w+/g);
    return matches ? matches.map(m => m.substring(1)) : [];
  }

  navigate(hash) {
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }

  getCurrentParams() {
    return this.currentParams;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  reload() {
    this.handleRouteChange();
  }
}

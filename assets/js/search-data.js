// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-reading-your-own-mail-what-xhr-interception-actually-is",
      
        title: "Reading Your Own Mail: What XHR Interception Actually Is",
      
      description: "Starting from a simple question—where does all this data come from?—a math student&#39;s tour through XHR/Fetch interception, the client-server trust boundary, stateless HTTP, and why location (not the tool) decides whether you&#39;re debugging or attacking.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/XHR-and-XHR-Intercepts/";
        
      },
    },{id: "post-navigating-the-city-with-math-from-navy-waves-to-traffic-waves",
      
        title: "Navigating the City with Math: From Navy Waves to Traffic Waves",
      
      description: "A deep dive into STGMS and Spectral Graph Theory, connecting naval experiences to urban traffic flow.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/STGMS-Review/";
        
      },
    },{id: "post-knapsackproblem",
      
        title: "KnapsackProblem",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/Knapsack-Problem/";
        
      },
    },{id: "post-traffifoptimization",
      
        title: "TraffifOptimization",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/Traffic-Optimization/";
        
      },
    },{id: "post-unmasking-the-cross-product-a-determinant-39-s-disguise",
      
        title: "Unmasking the Cross Product: A Determinant&#39;s Disguise",
      
      description: "Diving deep into the geometric intuition and proofs behind the cross product using rotation matrices and determinants.",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/Thoughts-on-Cross-Product/";
        
      },
    },{id: "post-tsp-s",
      
        title: "TSP(s)",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/TSP-Problems/";
        
      },
    },{id: "post-circulant-matrix-eigenvectors-values",
      
        title: "Circulant Matrix + Eigenvectors/values",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2024/Circulant-Matrix-and-Eigenvectors&values/";
        
      },
    },{id: "post-laplacian-matrix-basic-properties",
      
        title: "Laplacian Matrix - Basic Properties",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2024/Laplacian-Matrix-(Basic-Properties)/";
        
      },
    },{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-getting-started-with",
          title: 'Getting Started with',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-efm32gg990-with-hc-sr04",
          title: 'EFM32GG990 with HC-SR04',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/EFM3GG990-HC-SR04/";
            },},{id: "projects-efm32gg990-hc-sr04-with-tty-on-vbox",
          title: 'EFM32GG990 HC SR04 with TTY on VBox',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/efm32_uart_logger_alfolio/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];

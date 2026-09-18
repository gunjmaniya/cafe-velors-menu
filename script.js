document.addEventListener("DOMContentLoaded", function () {
  const categoryNav =
    document.querySelector(".category-nav");

  const categoryList =
    document.querySelector(".category-list");

  const categoryLinks =
    document.querySelectorAll(".category-link");

  const menuSections =
    document.querySelectorAll(".menu-section");

  const menuItems =
    document.querySelectorAll(".menu-item");

  const searchInput =
    document.getElementById("menuSearch");

  const noResults =
    document.getElementById("noResults");

  const backToTop =
    document.getElementById("backToTop");


  /*
   * Active category set કરવાનું function
   */

  function setActiveCategory(activeLink) {
    categoryLinks.forEach(function (link) {
      link.classList.remove("active");
    });

    activeLink.classList.add("active");

    /*
     * Navigation ફક્ત horizontally scroll થશે.
     * આખું page ઉપર-નીચે move નહીં થાય.
     */

    if (categoryList) {
      const linkCenter =
        activeLink.offsetLeft +
        activeLink.offsetWidth / 2;

      const containerCenter =
        categoryList.offsetWidth / 2;

      categoryList.scrollTo({
        left: linkCenter - containerCenter,
        behavior: "smooth"
      });
    }
  }


  /*
   * Category button click smooth scroll
   */

  categoryLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId =
        link.getAttribute("href");

      const targetSection =
        document.querySelector(targetId);

      if (!targetSection) {
        return;
      }

      const navigationHeight =
        categoryNav
          ? categoryNav.offsetHeight
          : 0;

      const targetPosition =
        targetSection.getBoundingClientRect().top +
        window.pageYOffset -
        navigationHeight -
        15;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      setActiveCategory(link);
    });
  });


  /*
   * Page scroll પ્રમાણે category active કરવી
   */

  function updateActiveCategory() {
    const navigationHeight =
      categoryNav
        ? categoryNav.offsetHeight
        : 0;

    const currentPosition =
      window.pageYOffset +
      navigationHeight +
      80;

    let activeSection = null;

    menuSections.forEach(function (section) {
      const isVisible =
        !section.classList.contains("hidden");

      if (
        isVisible &&
        section.offsetTop <= currentPosition
      ) {
        activeSection = section;
      }
    });

    if (!activeSection) {
      return;
    }

    const activeLink =
      document.querySelector(
        `.category-link[href="#${activeSection.id}"]`
      );

    if (
      activeLink &&
      !activeLink.classList.contains("active")
    ) {
      setActiveCategory(activeLink);
    }
  }


  /*
   * Menu search
   */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      function () {
        const searchText =
          searchInput.value
            .trim()
            .toLowerCase();

        let visibleItems = 0;

        menuItems.forEach(function (item) {
          const itemText =
            item.textContent.toLowerCase();

          const itemMatches =
            itemText.includes(searchText);

          item.classList.toggle(
            "hidden",
            !itemMatches
          );

          if (itemMatches) {
            visibleItems++;
          }
        });

        /*
         * Empty category hide કરવી
         */

        menuSections.forEach(function (section) {
          const visibleItem =
            section.querySelector(
              ".menu-item:not(.hidden)"
            );

          section.classList.toggle(
            "hidden",
            !visibleItem
          );
        });

        /*
         * No result message
         */

        if (noResults) {
          noResults.hidden =
            visibleItems !== 0;
        }

        /*
         * Search clear થાય ત્યારે
         * category position update કરવી
         */

        if (searchText === "") {
          updateActiveCategory();
        }
      }
    );
  }


  /*
   * Back-to-top button
   */

  function updateBackToTopButton() {
    if (!backToTop) {
      return;
    }

    if (window.pageYOffset > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  if (backToTop) {
    backToTop.addEventListener(
      "click",
      function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }


  /*
   * Scroll event
   */

  let scrollTimer;

  window.addEventListener(
    "scroll",
    function () {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(
        function () {
          updateActiveCategory();
          updateBackToTopButton();
        },
        30
      );
    },
    {
      passive: true
    }
  );


  /*
   * Initial setup
   */

  if (categoryLinks.length > 0) {
    setActiveCategory(categoryLinks[0]);
  }

  updateActiveCategory();
  updateBackToTopButton();
});
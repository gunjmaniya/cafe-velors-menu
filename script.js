document.addEventListener("DOMContentLoaded", () => {
  const categoryNav =
    document.querySelector(".category-nav");

  const categoryList =
    document.querySelector(".category-list");

  const categoryLinks = [
    ...document.querySelectorAll(".category-link")
  ];

  const menuSections = [
    ...document.querySelectorAll(".menu-section")
  ];

  const menuItems = [
    ...document.querySelectorAll(".menu-item")
  ];

  const searchInput =
    document.querySelector("#menuSearch");

  const noResults =
    document.querySelector("#noResults");


  /* Selected Items Elements */

  const selectionBar =
    document.querySelector("#billBar");

  const selectionCount =
    document.querySelector("#billCount");

  const selectionBarTotal =
    document.querySelector("#billBarTotal");

  const selectionSheet =
    document.querySelector("#cartSheet");

  const selectionOverlay =
    document.querySelector("#cartOverlay");

  const selectedItemsList =
    document.querySelector("#cartList");

  const emptySelection =
    document.querySelector("#emptyCart");

  const subtotalElement =
    document.querySelector("#subtotal");

  const totalPriceElement =
    document.querySelector("#grandTotal");

  const closeSelectionButton =
    document.querySelector("#closeCart");

  const clearSelectionButton =
    document.querySelector("#clearOrder");

  const toast =
    document.querySelector("#toast");


  /* Selected Items Data */

  const selectedItems = new Map();

  let toastTimer;


  /*
   * Format price in Indian number format
   */

  function formatPrice(price) {
    return new Intl.NumberFormat(
      "en-IN"
    ).format(price);
  }


  /*
   * Get menu item name and price
   */

  function getMenuItemData(menuItem) {
    const itemName =
      menuItem
        .querySelector("h3")
        ?.textContent
        ?.trim() || "Menu item";

    const priceElement =
      menuItem.querySelector(
        ":scope > strong"
      );

    const priceText =
      priceElement?.textContent || "0";

    const itemPrice =
      Number(
        priceText.replace(/\D/g, "")
      ) || 0;

    return {
      name: itemName,
      price: itemPrice
    };
  }


  /*
   * Show small notification
   */

  function showToast(message) {
    if (!toast) {
      return;
    }

    window.clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 1100);
  }


  /*
   * Add menu item
   */

  function addMenuItem(menuItem) {
    const itemData =
      getMenuItemData(menuItem);

    const itemKey =
      itemData.name.toLowerCase();

    const existingItem =
      selectedItems.get(itemKey);

    if (existingItem) {
      existingItem.quantity++;

      selectedItems.set(
        itemKey,
        existingItem
      );
    } else {
      selectedItems.set(itemKey, {
        name: itemData.name,
        price: itemData.price,
        quantity: 1
      });
    }

    renderSelectedItems();

    showToast(
      `${itemData.name} added`
    );
  }


  /*
   * Change item quantity
   */

  function changeQuantity(
    itemKey,
    quantityChange
  ) {
    const selectedItem =
      selectedItems.get(itemKey);

    if (!selectedItem) {
      return;
    }

    selectedItem.quantity +=
      quantityChange;

    if (selectedItem.quantity <= 0) {
      selectedItems.delete(itemKey);
    } else {
      selectedItems.set(
        itemKey,
        selectedItem
      );
    }

    renderSelectedItems();
  }


  /*
   * Create selected item row
   */

  function createSelectedItemRow(
    itemKey,
    selectedItem
  ) {
    const row =
      document.createElement("div");

    row.className = "selected-row";


    /* Item Information */

    const itemInformation =
      document.createElement("div");

    const itemName =
      document.createElement("h3");

    itemName.textContent =
      selectedItem.name;

    const singleItemPrice =
      document.createElement("span");

    singleItemPrice.textContent =
      `₹${formatPrice(
        selectedItem.price
      )} each`;


    /* Quantity Controls */

    const quantityContainer =
      document.createElement("div");

    quantityContainer.className = "qty";


    const minusButton =
      document.createElement("button");

    minusButton.type = "button";
    minusButton.textContent = "−";

    minusButton.setAttribute(
      "aria-label",
      `Remove one ${selectedItem.name}`
    );

    minusButton.addEventListener(
      "click",
      () => {
        changeQuantity(
          itemKey,
          -1
        );
      }
    );


    const quantityNumber =
      document.createElement("b");

    quantityNumber.textContent =
      selectedItem.quantity;


    const plusButton =
      document.createElement("button");

    plusButton.type = "button";
    plusButton.textContent = "+";

    plusButton.setAttribute(
      "aria-label",
      `Add one more ${selectedItem.name}`
    );

    plusButton.addEventListener(
      "click",
      () => {
        changeQuantity(
          itemKey,
          1
        );
      }
    );


    quantityContainer.append(
      minusButton,
      quantityNumber,
      plusButton
    );

    itemInformation.append(
      itemName,
      singleItemPrice,
      quantityContainer
    );


    /* Full Item Price */

    const itemTotalElement =
      document.createElement("strong");

    const itemTotal =
      selectedItem.price *
      selectedItem.quantity;

    itemTotalElement.textContent =
      `₹${formatPrice(itemTotal)}`;


    row.append(
      itemInformation,
      itemTotalElement
    );

    return row;
  }


  /*
   * Render selected items
   */

  function renderSelectedItems() {
    if (!selectedItemsList) {
      return;
    }

    selectedItemsList.innerHTML = "";

    let totalQuantity = 0;
    let completeTotal = 0;

    selectedItems.forEach(
      (selectedItem, itemKey) => {
        totalQuantity +=
          selectedItem.quantity;

        completeTotal +=
          selectedItem.price *
          selectedItem.quantity;

        const selectedItemRow =
          createSelectedItemRow(
            itemKey,
            selectedItem
          );

        selectedItemsList.appendChild(
          selectedItemRow
        );
      }
    );


    /* Update total quantity */

    if (selectionCount) {
      selectionCount.textContent =
        totalQuantity;
    }


    /* Update selection bar total */

    if (selectionBarTotal) {
      selectionBarTotal.textContent =
        formatPrice(completeTotal);
    }


    /* Update subtotal */

    if (subtotalElement) {
      subtotalElement.textContent =
        formatPrice(completeTotal);
    }


    /* Update final total */

    if (totalPriceElement) {
      totalPriceElement.textContent =
        formatPrice(completeTotal);
    }


    /* Show selection bar */

    if (selectionBar) {
      selectionBar.hidden =
        totalQuantity === 0;
    }


    /* Empty selection message */

    if (emptySelection) {
      emptySelection.hidden =
        totalQuantity !== 0;
    }


    /* Disable clear button */

    if (clearSelectionButton) {
      clearSelectionButton.disabled =
        totalQuantity === 0;
    }
  }


  /*
   * Menu item add buttons
   */

  const menuAddButtons =
    document.querySelectorAll(
      ".menu-item > button"
    );

  menuAddButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const menuItem =
          button.closest(".menu-item");

        if (!menuItem) {
          return;
        }

        addMenuItem(menuItem);

        button.textContent = "✓";
        button.disabled = true;

        window.setTimeout(() => {
          button.textContent = "+";
          button.disabled = false;
        }, 500);
      }
    );
  });


  /*
   * Open selected items
   */

  function openSelectionSheet() {
    if (
      !selectionSheet ||
      !selectionOverlay
    ) {
      return;
    }

    selectionSheet.classList.add(
      "show"
    );

    selectionOverlay.classList.add(
      "show"
    );

    selectionSheet.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "locked"
    );
  }


  /*
   * Close selected items
   */

  function closeSelectionSheet() {
    if (
      !selectionSheet ||
      !selectionOverlay
    ) {
      return;
    }

    selectionSheet.classList.remove(
      "show"
    );

    selectionOverlay.classList.remove(
      "show"
    );

    selectionSheet.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "locked"
    );
  }


  selectionBar?.addEventListener(
    "click",
    openSelectionSheet
  );

  closeSelectionButton?.addEventListener(
    "click",
    closeSelectionSheet
  );

  selectionOverlay?.addEventListener(
    "click",
    closeSelectionSheet
  );


  /*
   * Clear all selected items
   */

  clearSelectionButton?.addEventListener(
    "click",
    () => {
      selectedItems.clear();

      renderSelectedItems();
      closeSelectionSheet();

      showToast(
        "Selection cleared"
      );
    }
  );


  /*
   * Close panel with Escape key
   */

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeSelectionSheet();
      }
    }
  );


  /*
   * Category navigation
   */

  function activateCategory(activeLink) {
    categoryLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link === activeLink
      );
    });

    if (
      !categoryList ||
      !activeLink
    ) {
      return;
    }

    const linkCenter =
      activeLink.offsetLeft +
      activeLink.clientWidth / 2;

    const categoryCenter =
      categoryList.clientWidth / 2;

    categoryList.scrollTo({
      left:
        linkCenter -
        categoryCenter,
      behavior: "smooth"
    });
  }


  categoryLinks.forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();

        const sectionId =
          link.getAttribute("href");

        const selectedSection =
          document.querySelector(
            sectionId
          );

        if (!selectedSection) {
          return;
        }

        const navigationHeight =
          categoryNav
            ? categoryNav.offsetHeight
            : 0;

        const sectionPosition =
          selectedSection
            .getBoundingClientRect()
            .top +
          window.scrollY -
          navigationHeight -
          10;

        window.scrollTo({
          top: sectionPosition,
          behavior: "smooth"
        });

        activateCategory(link);
      }
    );
  });


  /*
   * Update active category on scroll
   */

  function updateActiveCategory() {
    if (menuSections.length === 0) {
      return;
    }

    const navigationHeight =
      categoryNav
        ? categoryNav.offsetHeight
        : 0;

    const scrollMarker =
      window.scrollY +
      navigationHeight +
      80;

    let currentSection =
      menuSections.find(
        (section) =>
          !section.classList.contains(
            "hidden"
          )
      );

    menuSections.forEach((section) => {
      const sectionIsVisible =
        !section.classList.contains(
          "hidden"
        );

      if (
        sectionIsVisible &&
        section.offsetTop <= scrollMarker
      ) {
        currentSection = section;
      }
    });

    if (!currentSection) {
      return;
    }

    const currentLink =
      categoryLinks.find(
        (link) =>
          link.getAttribute("href") ===
          `#${currentSection.id}`
      );

    if (
      currentLink &&
      !currentLink.classList.contains(
        "active"
      )
    ) {
      activateCategory(currentLink);
    }
  }


  /*
   * Menu search
   */

  searchInput?.addEventListener(
    "input",
    () => {
      const searchValue =
        searchInput.value
          .trim()
          .toLowerCase();

      let matchingItems = 0;

      menuItems.forEach((menuItem) => {
        const itemContent =
          menuItem.textContent
            .toLowerCase();

        const itemMatches =
          itemContent.includes(
            searchValue
          );

        menuItem.classList.toggle(
          "hidden",
          !itemMatches
        );

        if (itemMatches) {
          matchingItems++;
        }
      });


      /*
       * Hide category when empty
       */

      menuSections.forEach((section) => {
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
          matchingItems !== 0;
      }

      updateActiveCategory();
    }
  );


  /*
   * Page scroll
   */

  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;

      window.requestAnimationFrame(
        () => {
          updateActiveCategory();

          scrollTicking = false;
        }
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
    activateCategory(
      categoryLinks[0]
    );
  }

  renderSelectedItems();
  updateActiveCategory();
});

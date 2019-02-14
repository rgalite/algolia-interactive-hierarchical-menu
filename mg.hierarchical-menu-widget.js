window.customAlgolia = {};
window.customAlgolia.HierarchicalMenuWidget = function({
  container,
  attributes,
  ...optionalParameters
}) {
  const defaultOptions = {
    limit: 10,
    showMore: true,
    showMoreLimit: 10,
    separator: " > ",
    rootPath: null,
    //    showParentLevel: false,
    //    sortBy: () => {},
    templates: {},
    cssClasses: {
      returnButton: "return-button",
      titleWrapper: "title",
      rootTitleWrapper: "title title--centered",
      list: "category-list",
      item: "category"
    }
    //    transformItems: () => {}
  };

  this.options = {
    ...defaultOptions,
    ...optionalParameters,
    container,
    attributes
  };

  this.complete = true;
};

window.customAlgolia.HierarchicalMenuWidget.prototype.getConfiguration = function() {
  return {
    facets: this.options.attributes
  };
};

window.customAlgolia.HierarchicalMenuWidget.prototype.attachPreviousClickEvent = function({
  state,
  helper,
  button,
  currentLevel
}) {
  button.addEventListener("click", e => {
    helper
      .removeFacetRefinement(this.options.attributes[currentLevel - 1])
      .search();
  });
};

window.customAlgolia.HierarchicalMenuWidget.prototype.init = function({
  helper,
  state
}) {
  this.container =
    typeof this.options.container === "string"
      ? document.querySelector(this.options.container)
      : this.options.container;
};

window.customAlgolia.HierarchicalMenuWidget.prototype.getSelectedFacetsName = function({
  level,
  facetsRefinements
}) {
  const facetRefinementName = this.options.attributes[level];

  return facetsRefinements[facetRefinementName]
    .map(facetName => {
      const splittedFacetName = facetName.split(this.options.separator);
      return splittedFacetName[splittedFacetName.length - 1];
    })
    .join(", ");
};

window.customAlgolia.HierarchicalMenuWidget.prototype.render = function({
  results,
  helper,
  state
}) {
  const currentLevel = Object.keys(state.facetsRefinements).length;
  this.container.innerHTML = "";

  // Add a previous button
  if (currentLevel) {
    const facetName = this.getSelectedFacetsName({
      level: currentLevel - 1,
      facetsRefinements: state.facetsRefinements
    });

    const prevButton = document.createElement("a");
    prevButton.setAttribute("class", this.options.cssClasses.returnButton);
    prevButton.innerHTML = `&lt;`;

    this.attachPreviousClickEvent({
      helper,
      state,
      currentLevel,
      button: prevButton
    });

    const title = document.createElement("span");
    title.innerHTML = facetName;

    const rightThingy = document.createElement("span");
    rightThingy.innerHTML = "&nbsp;";

    const titleWrapper = document.createElement("div");
    titleWrapper.setAttribute("class", this.options.cssClasses.titleWrapper);

    titleWrapper.appendChild(prevButton);
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(rightThingy);

    this.container.appendChild(titleWrapper);
  } else {
    const titleWrapper = document.createElement("div");
    titleWrapper.setAttribute(
      "class",
      this.options.cssClasses.rootTitleWrapper
    );

    if (this.options.rootPath) {
      titleWrapper.innerHTML = this.options.rootPath;
    }

    this.container.appendChild(titleWrapper);
  }

  const list = document.createElement("div");
  list.setAttribute("class", this.options.cssClasses.list);

  const facets = results.facets[currentLevel];

  if (facets) {
    Object.keys(facets.data).forEach((facetName, index) => {
      const link = document.createElement("a");
      const splittedFacetName = facetName.split(this.options.separator);
      const innerHTML = splittedFacetName[splittedFacetName.length - 1];

      link.setAttribute("class", this.options.cssClasses.item);

      if (index >= this.options.showMoreLimit) {
        link.setAttribute("style", "display: none;");
      }

      link.innerHTML = `${innerHTML} (${facets.data[facetName]})`;
      link.addEventListener("click", event => {
        const facetRefinementName = this.options.attributes[currentLevel];
        helper.addFacetRefinement(facetRefinementName, facetName).search();
      });

      list.appendChild(link);
    });

    this.container.appendChild(list);
  }
};

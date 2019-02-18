const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
)

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
})

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: hit => `
      <div class="hit">
        <div class="hit-image">
          <img src="${hit.image}" />
        </div>
        <div class="hit-content">
          <div>
            <div class="hit-name">${hit._highlightResult.name.value}</div>
            <div class="hit-description">${hit.description}</div>
          </div>
          <div class="hit-price">$${hit.price}</div>
        </div>
      </div>
      `,
    },
  })
)

search.addWidget(
  new customAlgolia.InteractiveHierarchicalMenuWidget({
    container: '#breadcrumb',
    attributes: [
      'hierarchicalCategories.lvl0',
      'hierarchicalCategories.lvl1',
      'hierarchicalCategories.lvl2',
      'hierarchicalCategories.lvl3',
    ],
    showMoreLimit: 8,
    transformItems: item => {
      const splittedFacetName = item.split(' > ')
      return splittedFacetName[splittedFacetName.length - 1]
    },
  })
)

search.start()

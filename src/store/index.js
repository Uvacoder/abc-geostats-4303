import { createStore } from 'vuex'

export default createStore({
  state: {
    // menu
    menuOpened: false,

    // filters
    pickedFilter: 'world',

    // search
    searchMode: false,
    searchQuery: '',

    // comparison list
    comparisonList: [],

    // countries data
    countriesData: [],
    filteredCountriesData: [],

    // local storage
    options: {}
  },
  mutations: {
    // menu
    setMenuOpened(state) {
      state.menuOpened = !state.menuOpened
    },

    // filters
    setPickedFilter(state, payload) {
      const {id} = payload
      state.pickedFilter = id

      // reset shown cards
      state.shownCards = 0
    },

    // search
    setSearchMode(state) {
      state.searchMode = !state.searchMode
    },

    setSearchQuery(state, payload) {
      const {query} = payload
      state.searchQuery = query

      /* if a search query is set (its length is greater than zero),
      then enable the search mode */
      state.searchMode = query.length > 0
    },

    // comparison list
    modifyComparisonList(state, payload) {
      const {countryName} = payload
      
      if (!state.comparisonList.includes(countryName)) {
        state.comparisonList.push(countryName)
      } else {
        state.comparisonList = state.comparisonList.filter(country => country != countryName)
      }
    },

    // countries data
    setCountriesData(state, payload) {
      const {data} = payload
      state.countriesData = data
    },

    setFilteredCountriesData(state) {
      if (state.searchMode) {
        state.filteredCountriesData = state.countriesData.filter(country => {
          return country.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        })
      } else {
        state.filteredCountriesData = state.countriesData.filter(country => {
          let filterId = ''

          if (country.region == 'Americas') {
            if (['Caribbean', 'South America'].includes(country.subregion)) {
              filterId = 'south_america'
            } else {
              filterId = 'north_america'
            }
          } else {
            filterId = country.region.charAt(0).toLowerCase() + country.region.slice(1)
          }

          return filterId == state.pickedFilter || state.pickedFilter == 'world'
        })
      }
    },

    // local storage
    syncOptions(state) {
      if (!localStorage.localOptions) {
        localStorage.setItem('localOptions', JSON.stringify({
          darkMode: false
        }))
      }

      state.options = JSON.parse(localStorage.localOptions)
    },

    changeOption(state, payload) {
      const {option, value} = payload

      state.options[option] = value
      localStorage.setItem('localOptions', JSON.stringify(state.options))
    }
  },
  actions: {
    // countries data
    getCountriesData(context) {
      fetch('https://restcountries.eu/rest/v2/all')
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          context.commit('setCountriesData', {data: data})
          context.commit('setFilteredCountriesData')
        })
    }
  },
  getters: {
    // menu
    menuOpened(state) {
      return state.menuOpened
    },

    // filters
    pickedFilter(state) {
      return state.pickedFilter
    },

    // search
    searchMode(state) {
      return state.searchMode
    },

    searchQuery(state) {
      return state.searchQuery
    },

    // comparison list
    comparisonList(state) {
      return state.comparisonList
    },

    // countries data
    countriesData(state) {
      return state.countriesData
    },

    filteredCountriesData(state) {
      return state.filteredCountriesData
    },

    // local storage
    options(state) {
      return state.options
    }
  }
})

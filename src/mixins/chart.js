import { mapState } from 'vuex'

const chart = {
    props: {
        data: Object,
        type: String
    },
    data() {
        return {
            graphData: [],
            graphColors: ['#006699', '#6E4673', '#649E0B', '#F6921E', '#D14343', '#00AFAF']
        }
    },
    methods: {
        getCountryFlag(name) {
            const data = this.countriesData.filter(country => country.name == name)[0]
            const {flag} = data

            return flag
        },
        getCountryData(name) {
            const data = this.countriesData.filter(country => country.name == name)[0]
            const {population, area} = data

            return {
                'Population': population,
                'Area': area,
                'Population density': population / area
            }
        },
        setGraphData() {
            this.graphData = []

            this.data.countries.forEach(country => {
                this.graphData.push({
                    label: country,
                    value: this.getCountryData(country)[this.data.compare]
                })
            })
        },
        convertLongNumber(number) {
            let n = number.toString()
            let convertParams = {
                divide: 1,
                suffix: ''
            }

            if (n.length >= 10 && n.length <= 12) {
                convertParams = {
                    divide: 10**9,
                    suffix: 'B'
                }
            } else if (n.length >= 7 && n.length <= 9) {
                convertParams = {
                    divide: 10**6,
                    suffix: 'M'
                }
            } else if (n.length >= 4 && n.length <= 6) {
                convertParams = {
                    divide: 10**3,
                    suffix: 'K'
                }
            }

            n = (number / convertParams.divide).toString()

            if (n.includes('.')) {
                n = n.substring(0, n.indexOf('.') + 2)
            }

            n += convertParams.suffix

            return n
        },
        statsLink(name) {
            const countryId = name.replaceAll(' ', '_')

            this.$router.push({
                name: 'Statistics',
                params: {
                    country: countryId
                }
            })
        },
        getShortenedName(name) {
            return name.length > 14 ? name.substring(0, 14) + "..." : name
        }
    },
    computed: {
        ...mapState([
            'countriesData'
        ]),
        graphMax() {
           return Math.max(...this.graphData.map(bar => bar.value))
        }
    },
    watch: {
        data: {
            handler: function() {
                this.setGraphData()
            },
            deep: true
        }
    },
    mounted() {
        this.setGraphData()
    }
}

export default chart
import {assign, createMachine} from "xstate";

const mapMachine = createMachine({
    id: 'map',
    initial: 'idle',
    context: {
        selectedCountryId: null,
        previousZoom: 1,

    },
    states: {
        idle: {
            on: {
                SELECT_COUNTRY: {
                    target: 'highlighted',
                    actions: 'setSelectedCountry'
                }
            }
        },
        highlighted: {
            entry: 'logSelectedCountry',
            on: {
                EXIT_HIGHLIGHT:{
                    target: 'idle'
                }
            }
        }
    }
}, {
    actions: {
        // action implementations
        setSelectedCountry: assign({
            selectedCountryId: (context, event) => event.payload,
            previousZoom: (context, event) => event.previousZoom
        }),

        logSelectedCountry: (context) => {
            console.log(context.selectedCountryId)
        }
    }
})

export default mapMachine
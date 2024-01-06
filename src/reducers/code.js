const initialState = {
    codeData: 'code'
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState
    switch (action.type) {
        case 'setCodeData':
            return Object.assign({}, state, {
                codeData: action.codeData
            });
        default:
            return state
    }
}

const setCodeData = (codeData) => {
    return {
        type: 'setCodeData',
        codeData: codeData
    }
}

export {
    reducer as default,
    initialState as codeDataInitialState,
    setCodeData
}
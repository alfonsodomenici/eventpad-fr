const dFull = (data) => {
    const result = new Date(data)
    return result.toLocaleDateString('it-IT', {
        dateStyle: "full"
    });
}

const dMedium = (data) => {
    const result = new Date(data)
    return result.toLocaleDateString('it-IT', {
        dateStyle: "medium"
    });
}

const dShort = (data) => {
    const result = new Date(data)
    return result.toLocaleDateString('it-IT', {
        dateStyle: "short"
    });
}

export {dFull, dMedium, dShort};
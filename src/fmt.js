const dFull = (data) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const result = new Date(data)
    return result.toLocaleDateString('it-IT', options);
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
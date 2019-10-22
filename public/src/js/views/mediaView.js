

const insertMedia = (media) => {
    const hmtl = `
                <div>
                    <a href="#media${media._id}">${media.name}</a>
                </div>
                `
    document.querySelector('.left-box').insertAdjacentHTML('beforeend', hmtl)
}


export const renderMedia = (data) => {
    data.forEach(insertMedia)
}

export const rederMediaDetail = (media) => {
    const markup = `
        <div>
            <div>${media.name}</div>
            <div>${media.description}</div>
        </div>
    
    `
    document.querySelector('.container').insertAdjacentHTML('beforeend', markup)
}


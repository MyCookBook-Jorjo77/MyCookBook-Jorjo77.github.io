

export function getUserData() {
    const user = sessionStorage.getItem('user');
    if (user) {
        return JSON.parse(user);//sessionStorage and localStorage can store only string
    } else {
        return undefined;
    }
}

export function setUserData(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
}

export function clearUserData() {
    sessionStorage.removeItem('user');
}

export function inputValidate(furniture) {
    const make = furniture.make;
    const model = furniture.model;
    const year = Number(furniture.year);
    const description = furniture.description;
    const price = furniture.price;
    const imageUrl = furniture.imageUrl;

    if (make == '' ||
        model == '' ||
        year == '' ||
        description == '' ||
        price == '' ) {
        return ctx.render(createTemplate(onSubmit,
            'All fields are required',
            make == '',
            model == '',
            year == '',
            description == '',
            price == '',))

    }

    if (make.length < 4 && model.length < 4) {

        return ctx.render(createTemplate(onSubmit,
            'Symbols must be at least 4',
            true,
            true,
            false,
            false,
            false,
            false))

    }

    if (make.length < 4) {

        return ctx.render(createTemplate(onSubmit,
            'Symbols must be at least 4',
            true,
            false,
            false,
            false,
            false,
            false))

    }

    if (model.length < 4) {
        return ctx.render(createTemplate(onSubmit,
            'Symbols must be at least 4',
            false,
            true,
            false,
            false,
            false,
            false))
    }

    if (year < 1950 || year > 2050) {
        return ctx.render(createTemplate(onSubmit,
            'Year must be between 1950 and 2050',
            false,
            false,
            true,
            false,
            false,
            false))
    }

    if (description.length <= 10) {
        return ctx.render(createTemplate(onSubmit,
            'Description must be more than 10 symbols',
            false,
            false,
            false,
            true,
            false,
            false))
    }

    if (price < 0) {
        return ctx.render(createTemplate(onSubmit,
            'Price must be positive number',
            false,
            false,
            false,
            false,
            true,
            false))
    }

    if (!imageUrl) {
        return ctx.render(createTemplate(onSubmit,
            'Image is required',
            false,
            false,
            false,
            false,
            false,
            true))
    }
}
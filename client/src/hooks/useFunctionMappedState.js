import {useEffect, useState} from "react";

export const useFunctionMappedState = func => {
    const [value, setValue] = useState(func());

    useEffect(() => setValue(func()), [func, setValue]);

    return value;
};
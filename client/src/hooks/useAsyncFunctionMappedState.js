import {useEffect, useState} from "react";

export const useAsyncFunctionMappedState = (func, def) => {
    const [value, setValue] = useState(def);

    const work = async () => {
        setValue(await func());
    };

    useEffect(() => {
        work()
    }, [func, setValue]);

    return value;
};
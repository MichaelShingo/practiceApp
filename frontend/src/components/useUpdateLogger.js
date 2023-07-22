import { useEffect } from 'react';

export const useUpdateLogger = (value) => {
    return ( 
        useEffect(() => {
            console.log(value);
        }, [value])
     );
}
 
export default useUpdateLogger;
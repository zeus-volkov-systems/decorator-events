import { v4 as uuidv4 } from 'uuid';


export module IdUtils {

    export function getRandomUUID() {
        return uuidv4();
    }

}

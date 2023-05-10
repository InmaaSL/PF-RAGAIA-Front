import {Injectable} from '@angular/core';
import { Filtering } from './rest/Filtering';

@Injectable({
    providedIn: 'root',
})
export class MainService {

    static availableLanguages = ['es', 'en', 'nl', 'de', 'sv', 'cs'];

    public static selectCompareWithFn(a: { id: any; }, b: { id: any; }) {
        // eslint-disable-next-line eqeqeq
        return a && b && a.id == b.id;
    }

    /**
     * Since spread operator doesn't work [...myArray] neither  Object.assign([], myArray)
     *
     * @param obj
     *
     */
    public static deepCopy(obj: Filtering[]) {
        return JSON.parse(JSON.stringify(obj));
    }


}

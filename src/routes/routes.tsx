import {Share} from "../components/share/Share";
import {Retrieve} from "../components/retrieve/Retrieve";
import {useLocation} from "react-router-dom";

export function ShareRoute() {
    return <Share />
}

export function RetrieveRoute() {
    let location = useLocation()
    return <Retrieve shareSecret={location.hash.substring(1)}/>
}

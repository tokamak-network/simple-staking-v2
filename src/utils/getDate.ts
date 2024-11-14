import moment from "moment";

export function getDate (t: number) {
    var date = new Date(t*1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth()+1);
    var day = "0" + date.getDate();
    return year + "." + month.substr(-2) + "." + day.substr(-2)
}

export function fromNow (timestamp: number, suffix = false) {
    return moment.unix(timestamp).fromNow(suffix);
}
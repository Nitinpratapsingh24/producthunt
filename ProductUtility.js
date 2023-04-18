'use strict'
const specialCharactersArray =  [',','$','!','@','#','$','%','^','&','*'];

const isValidName = (name) => {
    if(!name || name.length==0 || name.length > 100) return false
    for(let i=0;i<name.length;i++)
    {
        if(specialCharactersArray.includes(name[i])) {
            return false;
        }
    }
    return true;
}
const isValidLongDesp = (desp) => {
    desp.split('').forEach((element) => {
        if(specialCharactersArray.includes(element) || desp.length > 500 ) return false
    });
    return true;
}
const isValidShortDesp = (desp) => {
    desp.split('').forEach((element) => {
        if(specialCharactersArray.includes(element) || desp.length > 100 ) return false
    });
    return true;
}
const isValidURL = (url) => {
    const newUrl = new URL(url);
    if(newUrl.protocol=='http:' || newUrl.protocol=='https:') {
        return true;
    } 
    else return false
}

const isValidInputProduct=(productInput)=>{

    if(!isValidName(productInput["name"])) 
    {
        return {err: "Inavlid name field"};
    }
    else if(!isValidShortDesp(productInput["short_desp"]))
    {
        return {err: "Inavlid short description"}
    }
    else if(!isValidLongDesp(productInput["long_desp"]))
    {
        return {err: "Inavlid long description"}
    } 
    else if(!isValidURL(productInput["icon_url"]))
    {
        return {err: "Inavlid Url"}
    }
    else if(!isValidURL(productInput["visit_url"]))
    {
        return {err: "Inavlid Url"}
    }
    
    return;
}
module.exports = {isValidInputProduct};
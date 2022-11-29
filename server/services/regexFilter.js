function regexFilter(string){
    const specialCharacters = '*.?+$^[](){}|\/';
    let strArray = string.split('');
    const regex = /,+/gm
    strArray.forEach((char,index)=>{
        if(specialCharacters.includes(char)){
            strArray[index] = '\\'+char;
        }
    })
    string = strArray.toString();
    string = string.replace(regex,'');
    return string;
}
export {regexFilter}
 const isAuthenticated = () => {
    let token = localStorage.getItem('token');
    if(token == null || token == undefined || token.length == 0) {
         return  false;
    }
    
    return true;
}

export default isAuthenticated;
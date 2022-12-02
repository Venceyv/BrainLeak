import axios from "axios";
    
async function fetchPhoto() {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users')
    return data
}
    
export default fetchPhoto;
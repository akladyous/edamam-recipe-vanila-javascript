
function urlHandler(){

};
const endPoint = 'https://api.edamam.com'
let urlPath = '/api/recipes/v2'
const url = new URL(endPoint);
url.pathname = urlPath;
url.searchParams.append('app_id', '088717c1');
url.searchParams.append('app_key', '2627cb5660ca36e2f0bfd72b2437768e');
url.searchParams.append('type', 'public');
url.searchParams.append('q', 'pizza')
console.log(url.toString())
// let urlString = url.toString();
async function request(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
        console.log(response.ok);
        console.log(response.body);
        console.log(data)
    } catch(err){
        console.log(err)
    }
    
}

// request(url.toString());

document.querySelector('#search-btn').addEventListener('click', (env)=>{
    alert('ok')
})
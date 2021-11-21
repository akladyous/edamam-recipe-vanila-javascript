

function removeAllChilds(){
    while(this.firstChild){
        this.removeChild(this.lastChild)
    }
}

function endPoint(query=null, path=null){
    const origin = 'https://api.edamam.com'
    let urlPath = '/api/recipes/v2'
    if(path !== null){
        urlPath += path
    };
    
    const url = new URL(origin);
    url.pathname = urlPath;
    url.searchParams.append('app_id', 'your app id');
    url.searchParams.append('app_key', 'your app key');
    url.searchParams.append('type', 'public');
    if(query !== null){
        url.searchParams.append('q', query)
    };
    return url.href;
}

async function request(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(err){
        console.log(err)
    }
};

let searchValue;
const main = document.querySelector('#main');
const form = document.querySelector('#search-form');

const restFormBttn = document.querySelector('#reset-bttn');
restFormBttn.addEventListener('click', () => {
    form.reset();
    main.classList.remove('active');
});


form.addEventListener('submit', (env)=>{
    env.preventDefault();
    const query = document.querySelector('#search-input')
    if(formValidation(query.value)){
        let data = request(endPoint(query.value));
        data.then( data => {
            lista = data
            generateRecipeList(data.hits);
            main.classList.add('active')
            searchValue = query.value;
        });
    }
});

function formValidation(query){
    if(query){
        if(query !== searchValue){
            return true
        } else {
            return false;
        }
    } else {
        return false;
    };
}

function generateRecipeList(result){
    const recipeLists = document.querySelector('.recipe-lists')
    removeAllChilds.call(recipeLists);
    const recipeItems = document.createElement('div')
    recipeItems.className = "recipe-list"

    result.forEach(item => {
        const recipeItems = document.createElement('div')
        recipeItems.className = "recipe-list"
        const recipeImage = document.createElement('img')
        recipeImage.className = "recipe-image"
        recipeImage.src = item.recipe.image;
        recipeImage.alt = item.recipe.label;

        const recipeNameDiv = document.createElement('div');
        recipeNameDiv.className = 'recipe-name-div';
        const recipeNameSpan = document.createElement('span');
        recipeNameSpan.className = 'recipe-name';
        recipeNameSpan.textContent = item.recipe.label;
        recipeNameDiv.appendChild(recipeNameSpan);

        const recipeInfo = document.createElement('div');
        recipeInfo.className = 'recipe-info';
        const recipeCalories = document.createElement('span');
        recipeCalories.textContent = `${item.recipe.calories.toFixed(2)} CALORIES`;
        const recipeIngredients = document.createElement('span');
        recipeIngredients.textContent = `${item.recipe.ingredients.length} INGREDIENTS`;
        recipeInfo.appendChild(recipeCalories);
        recipeInfo.appendChild(recipeIngredients);

        recipeItems.appendChild(recipeImage);
        recipeItems.appendChild(recipeNameDiv)
        recipeItems.appendChild(recipeInfo)

        recipeLists.appendChild(recipeItems);

        var uri = new URL(item._links.self.href);
        var recipeID = uri.pathname.slice(uri.pathname.lastIndexOf('/'));
        recipeItems.setAttribute('recipeID', recipeID);
    
        recipeItems.addEventListener('click', requestRecipebyID)
        
        recipeItems.addEventListener('mouseenter', (event) =>{
            event.currentTarget.style.boxShadow = '5px 5px 5px lightgray'
            event.currentTarget.style.backgroundColor = 'rgb(240, 235, 200)'
        });
        recipeItems.addEventListener('mouseout', (event) =>{
            event.currentTarget.style.boxShadow = 'none'
            event.currentTarget.style.backgroundColor = 'white'

        })
    });
};

function requestRecipebyID(event){
    let recipeID = event.currentTarget.getAttribute('recipeid')
    console.log(recipeID);
    let data = request(endPoint(null,recipeID))
    data.then( response => {
        ricetta = response;
        generateRecipe(response)
    } );
};

function generateRecipe(data){
    console.log(data)
    const recipe = document.querySelector('.recipe');
    
    removeAllChilds.call(recipe)

    const section1 = document.createElement('div')
    section1.classList.add('container', 'section-1')
    
        const section1ImageDiv = document.createElement('div');
        section1ImageDiv.className = 'image'
            const section1Image = document.createElement('img');
            section1Image.src = data.recipe.image;
            section1Image.alt = data.recipe.label;
        section1ImageDiv.appendChild(section1Image);
    
        const section1InfoDiv = document.createElement('div');
        section1InfoDiv.className = 'section-1-info';
            
            // Recipe Name container
            const recipeNameDiv = document.createElement('div');
            recipeNameDiv.className = 'recipe-name';
                const recipeName = document.createElement('h2');
                recipeName.textContent = data.recipe.label;
                recipeNameDiv.appendChild(recipeName);

            // Recipe Source container
            const recipeSourceDiv = document.createElement('div');
            recipeSourceDiv.className = 'recipe-source';
                    const sourceLink = document.createElement('a');
                        sourceLink.target ="_blank";
                        sourceLink.className = "recipe-source-anchor";
                        sourceLink.href = data.recipe.url;
                        sourceLink.textContent = "See full recipe on"
                    
                        const recipeShareBttn = document.createElement('button');
                        recipeShareBttn.textContent = "Share Recipe"
                        recipeShareBttn.addEventListener('click', (env) => {
                            window.open(data.recipe.shareAs, '_blank')
                        });

            recipeSourceDiv.appendChild(sourceLink);
            // recipeSourceDiv.appendChild(recipeShareBttn);

            // Recipe Detail Container
            const recipeShareDiv = document.createElement('div');
            recipeShareDiv.className = "recipe-detail";
                
                const recipeDetailDiv1 = document.createElement('div')
                const recipeDetailDiv2 = document.createElement('div')

                const cusineTypeTitle = document.createElement('h2')
                cusineTypeTitle.textContent = "Cusine Type"
                const cusineTypeList = document.createElement('ul');
                data.recipe.cuisineType.forEach(item => {
                    const cusineTypeItem = document.createElement('li');
                    cusineTypeItem.textContent = item
                    cusineTypeList.appendChild(cusineTypeItem);
                });
                recipeDetailDiv1.appendChild(cusineTypeTitle)
                recipeDetailDiv1.appendChild(cusineTypeList)

                const dietTypeTitle = document.createElement('h2')
                dietTypeTitle.textContent = "Diets"
                const dietTypeList = document.createElement('ul');
                data.recipe.dietLabels.forEach(item => {
                    const dietTypeItem = document.createElement('li');
                    dietTypeItem.textContent = item
                    dietTypeList.appendChild(dietTypeItem)
                });
                recipeDetailDiv2.appendChild(dietTypeTitle)
                recipeDetailDiv2.appendChild(dietTypeList)

            recipeShareDiv.appendChild(recipeDetailDiv1)
            recipeShareDiv.appendChild(recipeDetailDiv2)

        section1InfoDiv.appendChild(recipeNameDiv);
        section1InfoDiv.appendChild(recipeSourceDiv);
        section1InfoDiv.appendChild(recipeShareDiv);

    section1.appendChild(section1ImageDiv)
    section1.appendChild(section1InfoDiv)


    const section2 = document.createElement('div');
    section2.classList.add('container', 'section-2')
    
        const ingredientsDiv = document.createElement('div');
        ingredientsDiv.className = "ingredients"

            const ingredientsList = document.createElement('ul');
            const ingredientsTotal = document.createElement('h2');
            ingredientsTotal.textContent = `${data.recipe.ingredients.length} Ingredients`;
            data.recipe.ingredients.forEach(ingredient => {
                var _ingredientTag = document.createElement('li');
                _ingredientTag.textContent = ingredient.text;
                ingredientsList.appendChild(_ingredientTag);
            });
        ingredientsDiv.appendChild(ingredientsTotal);
        ingredientsDiv.appendChild(ingredientsList);

        const nutritionDiv = document.createElement('div');
        nutritionDiv.className = "nutrition"

        const healthTitle = document.createElement('h2');
        const nutrientsList = document.createElement('ul');
        healthTitle.textContent = `Nutrients`

            const _nutrients = data.recipe.totalNutrients;
            const _nutrientsList = new Array();

            for(let mainKey in _nutrients){
                if(typeof _nutrients[mainKey] === 'object'){
                    const keyValues = new Array()
                    for(let nestedKey in _nutrients[mainKey]){
                        if(typeof _nutrients[mainKey][nestedKey] === 'number'){
                            keyValues.push(_nutrients[mainKey][nestedKey].toFixed(2))
                        } else {
                            keyValues.push(_nutrients[mainKey][nestedKey])
                        }
                        // if not key.... other code
                    }
                    _nutrientsList.push(keyValues)
                }
            };
            nlist = _nutrientsList;
            _nutrientsList.forEach(item => {
                const _nutrient = document.createElement('li');
                _nutrient.textContent = item.join(' ');
                nutrientsList.appendChild(_nutrient)
            })
        nutritionDiv.appendChild(healthTitle)
        nutritionDiv.appendChild(nutrientsList)

    section2.appendChild(ingredientsDiv);
    section2.appendChild(nutritionDiv);


    // const section3 = document.createElement('div');
    // section3.classList.add('container', 'section-3');

    //     const feedBack = document.createElement('div');
    //     feedBack.className = "feedback";
    // section3.appendChild(feedBack);


    recipe.appendChild(section1);
    recipe.appendChild(section2);
    // recipe.appendChild(section3);
};